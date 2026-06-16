"""
Servico de geracao automatica de lista de compras a partir de um plano semanal.
Regra de Negocio Crucial (Fase 4 do plan.md):
  - Inspeciona as refeicoes do PlanoSemanal.
  - Busca os ingredientes de cada receita.
  - Soma as quantidades por ingrediente.
  - Popula os ItemCompra automaticamente.
"""

from collections import defaultdict

from apps.recipes.models import IngredienteReceita

from .models import ItemCompra, ListaCompra


def gerar_lista_compras(plano_semanal):
    """
    Gera (ou regenera) uma lista de compras a partir das refeicoes
    de um plano semanal.

    Retorna a ListaCompra criada/atualizada.
    """
    # Criar ou buscar a lista existente
    lista, created = ListaCompra.objects.get_or_create(
        plano_semanal=plano_semanal,
        defaults={
            "criador": plano_semanal.criador,
            "grupo": plano_semanal.grupo,
        },
    )

    if not created:
        # Sincroniza o grupo caso o plano semanal tenha mudado de grupo
        if lista.grupo != plano_semanal.grupo:
            lista.grupo = plano_semanal.grupo
            lista.save(update_fields=['grupo'])

        # Remover itens gerados automaticamente (que possuem ingrediente)
        # Itens manuais (nome_manual) sao preservados
        lista.itens.filter(ingrediente__isnull=False).delete()

    # Coletar ingredientes de todas as refeicoes do plano
    receitas_ids = plano_semanal.refeicoes.values_list("receita_id", flat=True)

    ingredientes_receita = IngredienteReceita.objects.filter(
        receita_id__in=receitas_ids
    ).select_related("ingrediente")

# Agregar quantidades por (ingrediente, unidade)
    agregado = defaultdict(lambda: {"quantidade": 0.0, "ingrediente": None})
    for ir in ingredientes_receita:
        # Padroniza a unidade (lowercase e sem espaços) para evitar que 'Kg' e 'kg' gerem itens duplicados
        unidade_padronizada = ir.unidade.lower().strip() if ir.unidade else ""
        
        # A chave agora é uma tupla: diferencia o ingrediente pela sua unidade
        chave = (ir.ingrediente_id, unidade_padronizada)
        
        agregado[chave]["quantidade"] += ir.quantidade
        agregado[chave]["ingrediente"] = ir.ingrediente

    # Criar itens de compra
    itens = []
    for chave, dados in agregado.items():
        ingrediente_id, unidade = chave
        itens.append(
            ItemCompra(
                lista_compra=lista,
                ingrediente=dados["ingrediente"],
                quantidade=dados["quantidade"],
                unidade=unidade,
                comprado=False,
            )
        )

    if itens:
        ItemCompra.objects.bulk_create(itens)

    return lista

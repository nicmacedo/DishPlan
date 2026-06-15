
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dishplan.settings")
django.setup()

from django.contrib.auth import get_user_model
from apps.recipes.models import Ingrediente, Receita, IngredienteReceita

User = get_user_model()

seed_user = User.objects.filter(is_superuser=True).first()
if not seed_user:
    raise Exception("Crie um superusuário antes de rodar o seed")

# Mapeamento das categorias do seed para os choices do modelo
CATEGORIA_MAP = {
    "grão":         "graos_cereais",
    "leguminosa":   "graos_cereais",
    "carne":        "carnes",
    "laticínio":    "laticinios",
    "tempero":      "temperos",
    "vegetal":      "hortifruti",
    "outro":        "outros",
    "gordura":      "outros",
    "condimento":   "temperos",
    "fruta":        "hortifruti",
    "fruto do mar": "carnes",
}

# Mapeamento das dificuldades do seed para os choices do modelo
DIFICULDADE_MAP = {
    "fácil":   "facil",
    "médio":   "medio",
    "difícil": "dificil",
}

#Ingredientes
ingredientes_data = [
    # (nome, categoria)
    ("Arroz branco", "grão"),
    ("Feijão carioca", "leguminosa"),
    ("Carne moída", "carne"),
    ("Frango (peito)", "carne"),
    ("Ovo", "laticínio"),
    ("Alho", "tempero"),
    ("Cebola", "vegetal"),
    ("Tomate", "vegetal"),
    ("Sal", "tempero"),
    ("Azeite de oliva", "gordura"),
    ("Óleo de soja", "gordura"),
    ("Farinha de trigo", "grão"),
    ("Leite", "laticínio"),
    ("Manteiga", "laticínio"),
    ("Açúcar", "outro"),
    ("Fermento em pó", "outro"),
    ("Cacau em pó", "outro"),
    ("Macarrão (espaguete)", "grão"),
    ("Bacon", "carne"),
    ("Queijo parmesão ralado", "laticínio"),
    ("Creme de leite", "laticínio"),
    ("Pimentão vermelho", "vegetal"),
    ("Cenoura", "vegetal"),
    ("Batata", "vegetal"),
    ("Coentro", "tempero"),
    ("Limão", "fruta"),
    ("Camarão limpo", "fruto do mar"),
    ("Leite de coco", "outro"),
    ("Azeite de dendê", "gordura"),
    ("Banana", "fruta"),
    ("Canela em pó", "tempero"),
    ("Pão de forma", "grão"),
    ("Presunto", "carne"),
    ("Queijo mussarela", "laticínio"),
    ("Manjericão fresco", "tempero"),
    ("Maionese", "condimento"),
    ("Mostarda", "condimento"),
    ("Ervilha (lata)", "leguminosa"),
    ("Milho (lata)", "vegetal"),
    ("Farinha de mandioca", "grão"),
]

ingrediente_objs = {}
for nome, categoria in ingredientes_data:
    obj, _ = Ingrediente.objects.get_or_create(
        nome=nome,
        defaults={"categoria": CATEGORIA_MAP.get(categoria, "outros")}
    )
    ingrediente_objs[nome] = obj

print(f"✔ {len(ingrediente_objs)} ingredientes prontos.")

#Receitas
# Estrutura:
# {
#   "titulo": str,
#   "descricao": str,
#   "modo_preparo": str,
#   "dificuldade": "fácil" | "médio" | "difícil",
#   "tempo_preparo": int (minutos),
#   "porcoes": int,
#   "ingredientes": [(nome, quantidade, unidade), ...]
# }

receitas_data = [
    {
        "titulo": "Arroz Branco Soltinho",
        "descricao": "Arroz básico, leve e soltinho, base de qualquer refeição brasileira.",
        "modo_preparo": (
            "1. Lave o arroz até a água ficar clara.\n"
            "2. Refogue o alho e a cebola no óleo até dourar.\n"
            "3. Adicione o arroz e mexa por 2 minutos.\n"
            "4. Coloque água quente (2 xícaras), sal e tampe.\n"
            "5. Cozinhe em fogo baixo por 15 minutos."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 25,
        "porcoes": 4,
        "ingredientes": [
            ("Arroz branco", 2, "xícara"),
            ("Alho", 3, "dente"),
            ("Cebola", 0.5, "unidade"),
            ("Óleo de soja", 2, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,  # Exemplo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
    },
    {
        "titulo": "Feijão Tropeiro",
        "descricao": "Prato mineiro robusto com feijão, bacon, farinha e couve.",
        "modo_preparo": (
            "1. Cozinhe o feijão na pressão por 25 minutos.\n"
            "2. Frite o bacon até ficar crocante, reserve a gordura.\n"
            "3. Refogue alho e cebola na gordura do bacon.\n"
            "4. Adicione o feijão cozido (sem caldo) e o bacon.\n"
            "5. Misture a farinha de mandioca aos poucos até absorver.\n"
            "6. Ajuste o sal e sirva com ovos mexidos por cima."
        ),
        "dificuldade": "médio",
        "tempo_preparo": 60,
        "porcoes": 6,
        "ingredientes": [
            ("Feijão carioca", 3, "xícara"),
            ("Bacon", 200, "g"),
            ("Alho", 4, "dente"),
            ("Cebola", 1, "unidade"),
            ("Farinha de mandioca", 1.5, "xícara"),
            ("Ovo", 4, "unidade"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Frango Grelhado com Limão",
        "descricao": "Peito de frango suculento marinado em limão e alho.",
        "modo_preparo": (
            "1. Tempere o frango com alho amassado, suco de limão e sal.\n"
            "2. Deixe marinar por 30 minutos na geladeira.\n"
            "3. Grelhe em frigideira antiaderente com um fio de azeite.\n"
            "4. Cozinhe 6 min de cada lado em fogo médio."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 45,
        "porcoes": 2,
        "ingredientes": [
            ("Frango (peito)", 2, "unidade"),
            ("Limão", 2, "unidade"),
            ("Alho", 3, "dente"),
            ("Azeite de oliva", 1, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Macarrão à Carbonara",
        "descricao": "Versão brasileira do clássico italiano cremoso com bacon e ovos.",
        "modo_preparo": (
            "1. Cozinhe o macarrão al dente conforme a embalagem.\n"
            "2. Frite o bacon em tiras até ficar crocante.\n"
            "3. Bata os ovos com o parmesão e pimenta-do-reino.\n"
            "4. Escorra o macarrão reservando 1 xícara da água do cozimento.\n"
            "5. Fora do fogo, misture o macarrão com os ovos batidos.\n"
            "6. Adicione água do cozimento para ajustar a cremosidade.\n"
            "7. Misture o bacon e sirva imediatamente."
        ),
        "dificuldade": "médio",
        "tempo_preparo": 30,
        "porcoes": 4,
        "ingredientes": [
            ("Macarrão (espaguete)", 400, "g"),
            ("Bacon", 150, "g"),
            ("Ovo", 4, "unidade"),
            ("Queijo parmesão ralado", 100, "g"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Omelete de Queijo e Presunto",
        "descricao": "Omelete clássica, rápida e proteica para qualquer hora do dia.",
        "modo_preparo": (
            "1. Bata os ovos com sal.\n"
            "2. Aqueça a manteiga em frigideira antiaderente.\n"
            "3. Despeje os ovos e mexa levemente com espátula.\n"
            "4. Quando as bordas firmarem, coloque presunto e queijo no centro.\n"
            "5. Dobre ao meio e sirva."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 10,
        "porcoes": 1,
        "ingredientes": [
            ("Ovo", 3, "unidade"),
            ("Presunto", 50, "g"),
            ("Queijo mussarela", 50, "g"),
            ("Manteiga", 10, "g"),
            ("Sal", 1, "pitada"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Bolo de Chocolate Simples",
        "descricao": "Bolo de chocolate fofinho de liquidificador, pronto em menos de 1 hora.",
        "modo_preparo": (
            "1. Preaqueça o forno a 180 °C.\n"
            "2. Bata no liquidificador os ovos, o leite, o óleo e o açúcar.\n"
            "3. Transfira para uma tigela e adicione a farinha, o cacau e o fermento, mexendo com fouet.\n"
            "4. Despeje em forma untada e asse por 35-40 minutos.\n"
            "5. Desenforme morno e cubra com calda de chocolate se desejar."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 55,
        "porcoes": 10,
        "ingredientes": [
            ("Farinha de trigo", 2, "xícara"),
            ("Açúcar", 1.5, "xícara"),
            ("Cacau em pó", 0.5, "xícara"),
            ("Ovo", 3, "unidade"),
            ("Leite", 1, "xícara"),
            ("Óleo de soja", 0.5, "xícara"),
            ("Fermento em pó", 1, "colher de sopa"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Moqueca de Camarão",
        "descricao": "Moqueca baiana cremosa com leite de coco e azeite de dendê.",
        "modo_preparo": (
            "1. Tempere o camarão com sal, limão e alho. Reserve 15 minutos.\n"
            "2. Refogue cebola, tomate e pimentão no dendê.\n"
            "3. Adicione o leite de coco e deixe ferver 5 minutos.\n"
            "4. Coloque o camarão e cozinhe por mais 5 minutos.\n"
            "5. Finalize com coentro picado e sirva com arroz."
        ),
        "dificuldade": "médio",
        "tempo_preparo": 40,
        "porcoes": 4,
        "ingredientes": [
            ("Camarão limpo", 500, "g"),
            ("Leite de coco", 200, "ml"),
            ("Azeite de dendê", 2, "colher de sopa"),
            ("Tomate", 2, "unidade"),
            ("Cebola", 1, "unidade"),
            ("Pimentão vermelho", 1, "unidade"),
            ("Alho", 3, "dente"),
            ("Limão", 1, "unidade"),
            ("Coentro", 1, "maço"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Frango Xadrez",
        "descricao": "Clássico da culinária chinesa-brasileira com frango, legumes e amendoim.",
        "modo_preparo": (
            "1. Corte o frango em cubos e tempere com sal.\n"
            "2. Refogue o frango no óleo até dourar, reserve.\n"
            "3. Refogue cebola, pimentão e cenoura em rodelas.\n"
            "4. Devolva o frango, adicione shoyu e um fio de água.\n"
            "5. Cozinhe 5 minutos e finalize com amendoim torrado."
        ),
        "dificuldade": "médio",
        "tempo_preparo": 35,
        "porcoes": 4,
        "ingredientes": [
            ("Frango (peito)", 600, "g"),
            ("Pimentão vermelho", 1, "unidade"),
            ("Cenoura", 1, "unidade"),
            ("Cebola", 1, "unidade"),
            ("Óleo de soja", 2, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Carne Moída Refogada",
        "descricao": "Carne moída temperada, versátil para recheios, arroz e macarrão.",
        "modo_preparo": (
            "1. Refogue alho e cebola no óleo até dourar.\n"
            "2. Adicione a carne moída e mexa até secar a água.\n"
            "3. Acrescente tomate picado, sal e cozinhe 10 minutos.\n"
            "4. Finalize com salsinha picada."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 25,
        "porcoes": 4,
        "ingredientes": [
            ("Carne moída", 500, "g"),
            ("Tomate", 2, "unidade"),
            ("Cebola", 1, "unidade"),
            ("Alho", 3, "dente"),
            ("Óleo de soja", 1, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Macarrão ao Molho de Tomate Caseiro",
        "descricao": "Molho de tomate feito do zero, saboroso e sem conservantes.",
        "modo_preparo": (
            "1. Cozinhe o macarrão conforme a embalagem.\n"
            "2. Refogue alho e cebola no azeite.\n"
            "3. Adicione tomates picados, sal e manjericão.\n"
            "4. Cozinhe em fogo baixo por 20 minutos.\n"
            "5. Misture ao macarrão escorrido e sirva com parmesão."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 40,
        "porcoes": 4,
        "ingredientes": [
            ("Macarrão (espaguete)", 400, "g"),
            ("Tomate", 5, "unidade"),
            ("Alho", 4, "dente"),
            ("Cebola", 1, "unidade"),
            ("Azeite de oliva", 3, "colher de sopa"),
            ("Manjericão fresco", 1, "maço"),
            ("Sal", 1, "colher de chá"),
            ("Queijo parmesão ralado", 50, "g"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Salpicão de Frango",
        "descricao": "Salada cremosa de frango desfiado com milho, ervilha e cenoura.",
        "modo_preparo": (
            "1. Cozinhe o frango em água com sal, desfie e reserve.\n"
            "2. Cozinhe a cenoura em cubinhos até ficar macia.\n"
            "3. Misture frango, cenoura, milho, ervilha, maionese e mostarda.\n"
            "4. Ajuste o sal e leve à geladeira por 30 minutos antes de servir."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 50,
        "porcoes": 6,
        "ingredientes": [
            ("Frango (peito)", 500, "g"),
            ("Cenoura", 1, "unidade"),
            ("Milho (lata)", 1, "lata"),
            ("Ervilha (lata)", 1, "lata"),
            ("Maionese", 3, "colher de sopa"),
            ("Mostarda", 1, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Batata Assada com Ervas",
        "descricao": "Batatas crocantes por fora e macias por dentro, temperadas com azeite e ervas.",
        "modo_preparo": (
            "1. Preaqueça o forno a 200 °C.\n"
            "2. Corte as batatas em cubos e tempere com azeite, alho amassado e sal.\n"
            "3. Espalhe em forma e asse por 35-40 minutos virando na metade.\n"
            "4. Sirva com salsinha picada."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 50,
        "porcoes": 4,
        "ingredientes": [
            ("Batata", 800, "g"),
            ("Azeite de oliva", 3, "colher de sopa"),
            ("Alho", 4, "dente"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Vitamina de Banana",
        "descricao": "Bebida cremosa e nutritiva de banana com leite, ideal para o café da manhã.",
        "modo_preparo": (
            "1. Coloque no liquidificador a banana, o leite e o açúcar.\n"
            "2. Bata por 1 minuto até ficar homogêneo.\n"
            "3. Sirva gelado com canela polvilhada."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 5,
        "porcoes": 2,
        "ingredientes": [
            ("Banana", 2, "unidade"),
            ("Leite", 500, "ml"),
            ("Açúcar", 1, "colher de sopa"),
            ("Canela em pó", 1, "pitada"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Pão na Chapa com Queijo",
        "descricao": "Lanche rápido e reconfortante de pão tostado na manteiga com queijo derretido.",
        "modo_preparo": (
            "1. Passe manteiga dos dois lados do pão de forma.\n"
            "2. Coloque em frigideira em fogo baixo.\n"
            "3. Adicione o queijo por cima e tampe por 2 minutos.\n"
            "4. Sirva quente."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 8,
        "porcoes": 1,
        "ingredientes": [
            ("Pão de forma", 2, "fatia"),
            ("Queijo mussarela", 40, "g"),
            ("Manteiga", 10, "g"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Estrogonofe de Frango",
        "descricao": "Versão brasileira do clássico russo, cremosa e levemente picante.",
        "modo_preparo": (
            "1. Refogue cebola e alho no óleo.\n"
            "2. Adicione o frango em cubos e doure.\n"
            "3. Tempere com sal, tomate e deixe cozinhar 10 min.\n"
            "4. Adicione o creme de leite, misture e desligue.\n"
            "5. Sirva com arroz e batata palha."
        ),
        "dificuldade": "médio",
        "tempo_preparo": 40,
        "porcoes": 4,
        "ingredientes": [
            ("Frango (peito)", 600, "g"),
            ("Creme de leite", 200, "ml"),
            ("Tomate", 2, "unidade"),
            ("Cebola", 1, "unidade"),
            ("Alho", 3, "dente"),
            ("Óleo de soja", 2, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Farofa de Manteiga",
        "descricao": "Farofa clássica, acompanhamento indispensável em churrasco e feijoada.",
        "modo_preparo": (
            "1. Derreta a manteiga em frigideira.\n"
            "2. Refogue a cebola até dourar.\n"
            "3. Adicione a farinha de mandioca aos poucos, mexendo sempre.\n"
            "4. Tempere com sal e mexa até a farinha ficar torradinha."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 15,
        "porcoes": 6,
        "ingredientes": [
            ("Farinha de mandioca", 2, "xícara"),
            ("Manteiga", 80, "g"),
            ("Cebola", 1, "unidade"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Ovo Mexido Cremoso",
        "descricao": "Ovos mexidos lentos e cremosos, técnica simples que transforma o café da manhã.",
        "modo_preparo": (
            "1. Bata os ovos com uma pitada de sal.\n"
            "2. Aqueça a manteiga em fogo baixo.\n"
            "3. Adicione os ovos e mexa lentamente com espátula de silicone.\n"
            "4. Retire do fogo enquanto ainda estão levemente cremosos."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 10,
        "porcoes": 1,
        "ingredientes": [
            ("Ovo", 3, "unidade"),
            ("Manteiga", 15, "g"),
            ("Sal", 1, "pitada"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Panqueca de Aveia com Banana",
        "descricao": "Panqueca fit de apenas três ingredientes, sem farinha de trigo.",
        "modo_preparo": (
            "1. Amasse a banana com um garfo.\n"
            "2. Misture com os ovos e a farinha de aveia até virar uma massa.\n"
            "3. Despeje pequenas porções em frigideira antiaderente untada.\n"
            "4. Doure dos dois lados e sirva com mel ou frutas."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 15,
        "porcoes": 2,
        "ingredientes": [
            ("Banana", 2, "unidade"),
            ("Ovo", 2, "unidade"),
            ("Farinha de trigo", 4, "colher de sopa"),
            ("Manteiga", 5, "g"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Caldo de Feijão",
        "descricao": "Caldo grosso e reconfortante feito com o feijão do dia a dia.",
        "modo_preparo": (
            "1. Cozinhe o feijão na pressão por 25 minutos.\n"
            "2. Refogue alho e cebola no óleo.\n"
            "3. Adicione o feijão com o caldo e o bacon.\n"
            "4. Bata parte do feijão no liquidificador para engrossar.\n"
            "5. Tempere com sal e sirva com coentro."
        ),
        "dificuldade": "médio",
        "tempo_preparo": 50,
        "porcoes": 4,
        "ingredientes": [
            ("Feijão carioca", 2, "xícara"),
            ("Bacon", 100, "g"),
            ("Alho", 3, "dente"),
            ("Cebola", 1, "unidade"),
            ("Coentro", 0.5, "maço"),
            ("Óleo de soja", 1, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
    {
        "titulo": "Steak de Frango com Molho de Maionese e Mostarda",
        "descricao": "Frango grelhado com molho rápido de maionese e mostarda, pronto em 20 minutos.",
        "modo_preparo": (
            "1. Abra o peito de frango em filé fino.\n"
            "2. Tempere com sal e alho.\n"
            "3. Grelhe no azeite por 5 min cada lado.\n"
            "4. Misture maionese e mostarda em igual proporção.\n"
            "5. Sirva o frango coberto com o molho e salada verde."
        ),
        "dificuldade": "fácil",
        "tempo_preparo": 20,
        "porcoes": 2,
        "ingredientes": [
            ("Frango (peito)", 2, "unidade"),
            ("Maionese", 2, "colher de sopa"),
            ("Mostarda", 2, "colher de sopa"),
            ("Alho", 2, "dente"),
            ("Azeite de oliva", 1, "colher de sopa"),
            ("Sal", 1, "colher de chá"),
        ],
        "imagem": None,
    },
]

#Add receita
created = 0
for dados in receitas_data:
    receita, is_new = Receita.objects.get_or_create(
        titulo=dados["titulo"],
        defaults={
            "descricao": dados["descricao"],
            "modo_preparo": dados["modo_preparo"],
            "dificuldade": DIFICULDADE_MAP.get(dados["dificuldade"], "facil"),
            "tempo_preparo": dados["tempo_preparo"],
            "porcoes": dados["porcoes"],
            "criador": seed_user,
            "is_publica": True,
        },
    )
    if is_new:
        for nome, quantidade, unidade in dados["ingredientes"]:
            ingrediente = ingrediente_objs.get(nome)
            if ingrediente:
                IngredienteReceita.objects.get_or_create(
                    receita=receita,
                    ingrediente=ingrediente,
                    defaults={"quantidade": quantidade, "unidade": unidade},
                )
        created += 1

print(f"✔ {created} receitas criadas ({len(receitas_data) - created} já existiam).")
print("Seed concluído com sucesso!")
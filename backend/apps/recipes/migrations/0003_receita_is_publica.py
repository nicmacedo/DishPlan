from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0002_receita_imagem"),
    ]

    operations = [
        migrations.AddField(
            model_name="receita",
            name="is_publica",
            field=models.BooleanField(
                default=False,
                help_text="Receitas públicas são visíveis para todos os usuários.",
                verbose_name="pública",
            ),
        ),
    ]

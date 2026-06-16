# Generated manually — adds imagem (base64 data URI) field to Receita.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="receita",
            name="imagem",
            field=models.TextField(
                blank=True,
                null=True,
                verbose_name="imagem",
            ),
        ),
    ]

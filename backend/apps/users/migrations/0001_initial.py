import apps.users.managers
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                ("last_login", models.DateTimeField(blank=True, null=True, verbose_name="last login")),
                ("is_superuser", models.BooleanField(
                    default=False,
                    help_text="Designates that this user has all permissions without explicitly assigning them.",
                    verbose_name="superuser status",
                )),
                ("email", models.EmailField(max_length=254, unique=True, verbose_name="e-mail")),
                ("nome", models.CharField(max_length=150, verbose_name="nome")),
                ("data_nascimento", models.DateField(blank=True, null=True, verbose_name="data de nascimento")),
                ("google_sub", models.CharField(
                    blank=True,
                    help_text="ID do usuario no Google (preenchido em login via OAuth).",
                    max_length=255,
                    null=True,
                    unique=True,
                    verbose_name="google subject id",
                )),
                ("is_active", models.BooleanField(default=True, verbose_name="ativo")),
                ("is_staff", models.BooleanField(default=False, verbose_name="staff")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="atualizado em")),
                ("groups", models.ManyToManyField(
                    blank=True,
                    help_text="The groups this user belongs to.",
                    related_name="user_set",
                    related_query_name="user",
                    to="auth.group",
                    verbose_name="groups",
                )),
                ("user_permissions", models.ManyToManyField(
                    blank=True,
                    help_text="Specific permissions for this user.",
                    related_name="user_set",
                    related_query_name="user",
                    to="auth.permission",
                    verbose_name="user permissions",
                )),
            ],
            options={
                "verbose_name": "usuario",
                "verbose_name_plural": "usuarios",
                "ordering": ["-created_at"],
            },
            managers=[
                ("objects", apps.users.managers.UserManager()),
            ],
        ),
    ]

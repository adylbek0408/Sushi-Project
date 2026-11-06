from django.db import migrations, models


def set_order_whatsapp(apps, schema_editor):
    ShopSettings = apps.get_model("core", "ShopSettings")
    ShopSettings.objects.update(whatsapp_number="996999310755")


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="shopsettings",
            name="whatsapp_number",
            field=models.CharField(
                default="996999310755",
                help_text="В международном формате без '+', например 996999310755.",
                max_length=20,
                verbose_name="WhatsApp номер",
            ),
        ),
        migrations.RunPython(set_order_whatsapp, migrations.RunPython.noop),
    ]

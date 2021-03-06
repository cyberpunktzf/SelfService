# Generated by Django 3.0.5 on 2021-12-08 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SelfServDB', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataContrastPortInargs',
            fields=[
                ('id', models.AutoField(db_index=True, primary_key=True, serialize=False, unique=True)),
                ('parid', models.CharField(blank=True, db_index=True, max_length=50, null=True)),
                ('seq', models.CharField(blank=True, max_length=50, null=True)),
                ('argcode', models.CharField(blank=True, max_length=50, null=True)),
                ('argname', models.CharField(blank=True, max_length=50, null=True)),
                ('contype', models.CharField(blank=True, max_length=50, null=True)),
                ('coninfo', models.CharField(blank=True, max_length=100, null=True)),
                ('argtype', models.CharField(blank=True, max_length=50, null=True)),
                ('mustl_flag', models.CharField(blank=True, max_length=50, null=True)),
                ('max_leng', models.CharField(blank=True, max_length=50, null=True)),
                ('subnode', models.CharField(blank=True, max_length=50, null=True)),
                ('subname', models.CharField(blank=True, max_length=50, null=True)),
                ('crter', models.CharField(blank=True, max_length=50, null=True)),
                ('crte_date', models.DateField(blank=True, null=True)),
                ('crte_time', models.TimeField(blank=True, null=True)),
                ('updt_id', models.CharField(blank=True, max_length=50, null=True)),
                ('updt_date', models.DateField(blank=True, null=True)),
                ('updt_time', models.TimeField(blank=True, null=True)),
                ('coninfodesc', models.CharField(blank=True, max_length=50, null=True)),
                ('parnode_type', models.CharField(blank=True, max_length=50, null=True)),
                ('codeflag', models.CharField(blank=True, max_length=50, null=True)),
                ('defvalue', models.CharField(blank=True, max_length=50, null=True)),
                ('coninfodemo', models.CharField(blank=True, max_length=50, null=True)),
                ('efft_flag', models.CharField(blank=True, max_length=50, null=True)),
                ('coninfosource', models.CharField(blank=True, max_length=50, null=True)),
                ('diccode', models.CharField(blank=True, max_length=50, null=True)),
                ('localparcode', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'data_contrast_port_inargs',
            },
        ),
        migrations.CreateModel(
            name='DataContrastPortList',
            fields=[
                ('id', models.AutoField(db_index=True, primary_key=True, serialize=False, unique=True)),
                ('type', models.CharField(blank=True, max_length=50, null=True)),
                ('hi_type', models.CharField(blank=True, max_length=50, null=True)),
                ('infno', models.CharField(blank=True, max_length=50, null=True)),
                ('infname', models.CharField(blank=True, max_length=50, null=True)),
                ('contenttype', models.CharField(blank=True, max_length=50, null=True)),
                ('signtype', models.CharField(blank=True, max_length=50, null=True)),
                ('chkflag', models.CharField(blank=True, max_length=50, null=True)),
                ('efftflag', models.CharField(blank=True, max_length=3, null=True)),
                ('url', models.CharField(blank=True, max_length=50, null=True)),
                ('node_code', models.CharField(blank=True, max_length=50, null=True)),
                ('his_ver', models.CharField(blank=True, max_length=50, null=True)),
                ('crter', models.CharField(blank=True, max_length=50, null=True)),
                ('crte_date', models.DateField(blank=True, null=True)),
                ('crte_time', models.TimeField(blank=True, null=True)),
                ('updt_id', models.CharField(blank=True, max_length=50, null=True)),
                ('updt_date', models.DateField(blank=True, null=True)),
                ('updt_time', models.TimeField(blank=True, null=True)),
                ('classname', models.CharField(blank=True, max_length=50, null=True)),
                ('methodname', models.CharField(blank=True, max_length=50, null=True)),
                ('outnode_code', models.CharField(blank=True, max_length=50, null=True)),
                ('buildinput', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'data_contrast_port_list',
            },
        ),
        migrations.CreateModel(
            name='DataContrastPortNode',
            fields=[
                ('id', models.AutoField(db_index=True, primary_key=True, serialize=False, unique=True)),
                ('parid', models.CharField(blank=True, db_index=True, max_length=50, null=True)),
                ('seq', models.CharField(blank=True, max_length=50, null=True)),
                ('nodecode', models.CharField(blank=True, max_length=50, null=True)),
                ('nodename', models.CharField(blank=True, max_length=50, null=True)),
                ('node_type', models.CharField(blank=True, max_length=50, null=True)),
                ('sub_flag', models.CharField(blank=True, max_length=50, null=True)),
                ('classname', models.CharField(blank=True, max_length=50, null=True)),
                ('methodname', models.CharField(blank=True, max_length=50, null=True)),
                ('methodtype', models.CharField(blank=True, max_length=50, null=True)),
                ('conflag', models.CharField(blank=True, max_length=50, null=True)),
                ('crter', models.CharField(blank=True, max_length=50, null=True)),
                ('crte_date', models.DateField(blank=True, null=True)),
                ('crte_time', models.TimeField(blank=True, null=True)),
                ('updt_id', models.CharField(blank=True, max_length=50, null=True)),
                ('updt_date', models.DateField(blank=True, null=True)),
                ('updt_time', models.TimeField(blank=True, null=True)),
                ('parnode_type', models.CharField(blank=True, max_length=50, null=True)),
                ('efft_flag', models.CharField(blank=True, max_length=50, null=True)),
                ('multrow', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'data_contrast_port_node',
            },
        ),
        migrations.CreateModel(
            name='ss_eqroleconfig',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True, verbose_name='RowId')),
                ('ss_eqrolecfg_code', models.CharField(db_index=True, max_length=20, null=True, verbose_name='????????????')),
                ('ss_eqrolecfg_desc', models.CharField(max_length=20, null=True, verbose_name='????????????')),
                ('ss_eqrolecfg_cfgcode', models.CharField(db_index=True, max_length=50, null=True, verbose_name='????????????')),
                ('ss_eqrolecfg_cfgdesc', models.CharField(max_length=100, null=True, verbose_name='????????????')),
                ('ss_eqrolecfg_cfgvalue', models.CharField(max_length=500, null=True, verbose_name='?????????')),
                ('ss_eqrolecfg_actflg', models.CharField(db_index=True, max_length=5, null=True, verbose_name='????????????')),
                ('ss_eqrolecfg_createdate', models.DateTimeField(auto_now_add=True)),
                ('ss_eqrolecfg_creator', models.CharField(max_length=50, null=True, verbose_name='?????????')),
                ('ss_eqrolecfg_update', models.DateTimeField(auto_now_add=True)),
                ('ss_eqrolecfg_upuser', models.CharField(max_length=50, null=True, verbose_name='??????')),
            ],
            options={
                'db_table': 'ss_eqroleconfig',
            },
        ),
        migrations.RemoveField(
            model_name='ss_tradedetails',
            name='ss_td_pattype',
        ),
        migrations.AddField(
            model_name='business_master',
            name='old_bm_id',
            field=models.CharField(db_index=True, max_length=50, null=True, verbose_name='????????????id'),
        ),
        migrations.AddField(
            model_name='patinfo',
            name='hi_type',
            field=models.CharField(db_index=True, max_length=20, null=True, verbose_name='????????????'),
        ),
        migrations.AddField(
            model_name='patinfo',
            name='his_patname',
            field=models.CharField(db_index=True, max_length=20, null=True, verbose_name='????????????'),
        ),
        migrations.AddField(
            model_name='patinfo',
            name='id_no',
            field=models.CharField(db_index=True, max_length=20, null=True, verbose_name='????????????'),
        ),
        migrations.AddField(
            model_name='ss_dicdata',
            name='ss_dic_catalog',
            field=models.CharField(db_index=True, max_length=50, null=True, verbose_name='????????????'),
        ),
        migrations.AddField(
            model_name='ss_docpicture',
            name='ss_dcp_name',
            field=models.CharField(db_index=True, max_length=20, null=True, verbose_name='????????????'),
        ),
        migrations.AddField(
            model_name='ss_tradedetails',
            name='ss_td_selfamt',
            field=models.CharField(max_length=20, null=True, verbose_name='??????????????????'),
        ),
        migrations.AlterField(
            model_name='ss_tradedetails',
            name='ss_td_creator',
            field=models.CharField(db_index=True, max_length=50, null=True, verbose_name='?????????'),
        ),
    ]

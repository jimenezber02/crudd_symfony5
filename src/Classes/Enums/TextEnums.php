<?php
namespace App\Classes\Enums;
class TextEnums
{
    static public $TipoUsuarioText = array(
        TipoUsuario::ADMINISTRADOR => 'Administrador',
        TipoUsuario::ABOGADO => 'Abogado',
        TipoUsuario::BUFETE => 'Bufete',
        TipoUsuario::SUBUSUARIO => 'Subusuario',
    );

    static  public $DocumentTypeText = array(
        DocumentType::PODER_REPRESENTACION => 'Poder de representación',
        DocumentType::DOCUMENTOS_SOLICITADOS => 'Solicitados',
    );

    static public $categryTypeText = array(
        CategoryType::TIPODOCUMENTO => 'Documento',
        CategoryType::TRAMITE => 'Tramite',
        CategoryType::DATOS_CLIENTE => 'Datos de cliente',
        CategoryType::DOCUMENTO_JURIDICO => 'Repositorio Jurídico',
    );

    static public $DependientesText = array(
        Depentiente::TODOS => 'TODOS',
        Depentiente::CONYUGUE => 'Cónyuge',
        Depentiente::HIJOS_MENORES_12 => 'Hijos menores de 12 años',
        Depentiente::HIJOS_ENTRE_12_25 => 'Hijos entre 12 y 25 años',
        Depentiente::PADRES => 'Padres',
        Depentiente::CLIENTE  => 'Cliente',
        Depentiente::DECENDIENTE_MENOR_12  => 'Descendiente menor 12',
        Depentiente::DECENDIENTE_MAYOR_12  => 'Descendiente mayor 12',
        Depentiente::INTERESADO  => 'Interesado',
    );

    static public $CampoTypeText = array(
        CampoType::TEXTO_CORTO => 'Texto corto(100)',
        CampoType::TEXTO_LARGO => 'Texto largo(1000)',
        CampoType::FECHA => 'Fecha',
        CampoType::NUMERO_CORTO => 'Número corto(2)',
        CampoType::NUMERO_LARGO => 'Número largo(10)',
        CampoType::CHECKBOX => 'Checkbox',
        CampoType::RADIO => 'Radio',
        CampoType::COMBO => 'Combo',
        CampoType::PAIS => 'País',
        CampoType::NACIONALIDAD => 'Nacionalidad',
        CampoType::NUMERO_DOCUMENTO => 'Número documento',
    );

    static public $GridBaseTypeText = array(
        GridBaseType::COL_1 => 'col-1',
        GridBaseType::COL_2 => 'col-2',
        GridBaseType::COL_3 => 'col-3',
        GridBaseType::COL_4 => 'col-4',
        GridBaseType::COL_5 => 'col-5',
        GridBaseType::COL_6 => 'col-6',
        GridBaseType::COL_7 => 'col-7',
        GridBaseType::COL_8 => 'col-8',
        GridBaseType::COL_9 => 'col-9',
        GridBaseType::COL_10 => 'col-10',
        GridBaseType::COL_11 => 'col-11',
        GridBaseType::COL_12 => 'col-12',
        GridBaseType::COL_MD_2 => 'col-md-2',
    );

    static public $registro_ok = 'Felicidades, tu cuenta se ha creado correctamente. Hemos enviado a tu email las instrucciones para activar tu cuenta.';
}
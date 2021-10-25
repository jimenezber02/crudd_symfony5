var CamposManager = {

    urls: null,

    init: function(urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function(){

        //region Campo
        $('[data-action="loadCampo"]').off('click').on('click', function () {
            var id = $(this).data('id');
            CamposManager.loadCampo(id);
        });

        $('[data-action="saveCampo"]').off('click').on('click', function () {
            CamposManager.saveCampo();
        });

        $('[data-action="deleteCampo"]').off('click').on('click', function () {
            var id = $(this).data('id');
            CamposManager.deleteCampo(id);
        });

        $('[data-action="enterFindCampo"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                CamposManager.loadCampos();
            }
        });

        $('[data-action="findCampo"]').off('click').on('click', function () {
            CamposManager.loadCampos();
        });

        $('[data-action="cleanfindCampo"]').off('click').on('click', function () {
            $('#form_search').trigger("reset");
            FormFielsManager.cleanSelec2('#selecDependen');
            FormFielsManager.cleanCategoyTree('#select_category_filter');
        });

        $('[data-action="selectTipo"]').off('change').on('change', function () {
            var tipo = $(this).val();
            if(tipo == 6 || tipo == 7 || tipo == 8){
                $('#container_campovalor').show();
            }else{
                $('#container_campovalor').hide();
            }
        });

        $('[data-action="loadVistaPrevia"]').off('click').on('click', function () {
            CamposManager.loadVistaPrevia()
        });

        $('[data-action="loadAyuda"]').off('click').on('click', function () {
            CamposManager.loadAyuda();
        });

        $('[data-action="chageRequerido"]').off('click').on('click', function () {
            var id = $(this).data('id');
            var requerido = 0;
            if($(this).prop('checked')){
                requerido = 1;
            }
            CamposManager.chageRequerido(id, requerido);
        });



        //endregion

        //region Campo valor
        $('[data-action="loadCampoValor"]').off('click').on('click', function () {
            var id = $(this).data('id');
            var idcampo = $(this).data('idcampo');
            CamposManager.loadCampoValor(id, idcampo);
        });

        $('[data-action="saveCampoValor"]').off('click').on('click', function () {
            CamposManager.saveCampoValor();
        });

        $('[data-action="deleteCampoValor"]').off('click').on('click', function () {
            var id = $(this).data('id');
            CamposManager.deleteCampoValor(id);
        });
        //endregion
    },

    //region Campo
    loadCampos: function (page= 1){
        var form_search = $('#form_search');
        TML.ajax({
            url: urls.loadCampos,
            data: form_search.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_campos').html(response);
                //si no esta seleccionada una categoria no activo el sortable
                var catselect = $('#select_category_filter').val();
                if(catselect){
                    $('#bodytablecampo').attr('data-sortable', 'true');
                }
                TableManager.initTable('#list_campos', CamposManager.loadCampos, [], CamposManager.urls.saveOrder);
                CamposManager._initEvents();
            }
        });
    },

    loadCampo: function (id){
        TML.ajax({
            url: urls.loadCampo,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_campo').modal('show');
                FormFielsManager.initCategoyTree(urls.loadTreeCategory,'#category_tree_container', '#select_category', '#categorie_tree', '');
                FormFielsManager.initTinymce('#textinfoextra');
                CamposManager.initSelectDependencia();
                if(id){
                    CamposManager.loadCamposValores();
                }
                CamposManager._initEvents();
            }
        });
    },

    saveCampo: function (){
        var form_campo = $('#form_campo');
        var text = tinymce.activeEditor.getContent();
        if(form_campo.valid()){
            TML.ajax({
                url: urls.saveCampo,
                data: form_campo.serialize()+'&text='+text,
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    if(response.error){
                        TML.showError('Ya existe un registro para el valor der VAR');
                    }else{
                        $('#modal_campo').modal('hide');
                        if(response.reload){
                            var tipo = $('#selectTipo').val();
                            if(tipo == 6 || tipo == 7 || tipo == 8){
                                CamposManager.loadCampo(response.reload);
                            }
                        }else{
                            CamposManager.loadCampos();
                        }
                        TML.showSuccess();
                    }
                }
            });
        }else{
            TML.showErrorValidacion();
        }

    },

    deleteCampo: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteCampo,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_campo'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },

    loadVistaPrevia: function (id){
        var nombre = $('#input_nombre').val();
        var tipo = $('#selectTipo').val();
        var ayuda = $('#input_ayuda').val();
        var requerimiento = $('#input_requerimiento').val();
        var infoextra = $('#textinfoextra').val();

        $('.container_tiposcampos').hide();
        $('.label_nombre').html(nombre);
        $('.span_ayuda').html(ayuda);
        $('.container_ico_ayuda').html('<span class="input-group-text" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-dark" data-bs-placement="top" title="Respuesta idonea:'+ requerimiento +'">' +
            '<i class="fa fa-exclamation-circle fs-5 text-warning"></i>' +
            '</span>');
        $('.container_ico_label').html('<i class="fa fa-exclamation-circle fs-5 text-warning" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-dark" data-bs-placement="top" title="Respuesta idonea:'+ requerimiento +'"></i>');
        switch (tipo){
            case '1':
            case '2':
            case '4':
            case '5':
            case '9':{
                $('#container_tiposcampo_texto').show();
                break;
            }
            case '3':{
                $('#container_tiposcampo_fecha').show();
                break;
            }
            case '6':{
                $('.container_options_check').html('');
                $('.opcion_valores').each(function (idx, item) {
                   var option = $(item).data('option');
                   var elemt = '<div class="form-check form-check-custom form-check-solid form-check-sm mb-3">' +
                       '<input class="form-check-input" type="checkbox" value="">' +
                       '<label class="form-check-label" for="flexRadioLg">'+ option +'</label>' +
                       '</div>';
                   $('.container_options_check').append(elemt);
                });
                $('#container_tiposcampo_check').show();
                break;
            }
            case '7':{
                $('.container_options_radio').html('');
                $('.opcion_valores').each(function (idx, item) {
                    var option = $(item).data('option');
                    var elemt = '<div class="form-check form-check-custom form-check-solid form-check-sm mb-3"> ' +
                        '<input class="form-check-input" type="radio" name="radio_options"> ' +
                        '<label class="form-check-label" for="flexRadioSm">'+ option +'</label> ' +
                        '</div>';
                    $('.container_options_radio').append(elemt);
                });
                $('#container_tiposcampo_radio').show();
                break;
            }
            case '8':{
                $('#container_options_combo').html('');
                $('#container_options_combo').append('<option value="" selected="selected">Seleccione un valor</option>');
                $('.opcion_valores').each(function (idx, item) {
                    var option = $(item).data('option');
                    var elemt = '<option value="">'+ option +'</option>';
                    $('#container_options_combo').append(elemt);
                });
                $('#container_tiposcampo_combo').show();
                break;
            }
            case '10':{
                FormFielsManager.initSelec2("#container_options_pais",CamposManager.urls.selectPaises,"Seleccione un pais");
                $('#container_tiposcampo_pais').show();
                break;
            }
            case '11':{
                FormFielsManager.initSelec2("#container_options_pais",CamposManager.urls.selectPaises,"Seleccione un pais", {
                    'nacionalidad': true
                });
                $('#container_tiposcampo_pais').show();
                break;
            }
        }
        KTApp.initBootstrapTooltips();
    },

    loadAyuda: function (){
        var infoextra = $('#textinfoextra').val();
        Swal.fire({
            html: infoextra,
            showConfirmButton: false
        });
    },

    initSelectDependencia: function (){
        FormFielsManager.initSelec2("#selecdepende",urls.selectCampos,"Seleccione el campo dependiente",{
            'tipos': [6,7,8]
        });

        FormFielsManager.initSelec2("#selecvalores",urls.selectCamposValores,"Seleccione el valor");
        $('#selecvalores').data('idselect', '');
        $('#selecvalores').data('textselect', '');
        $('#selecdepende').on('select2:select', function (e) {
            $('#selecvalores').val(null).trigger('change');
            var idcampo = $('#selecdepende').val();
            FormFielsManager.initSelec2("#selecvalores",urls.selectCamposValores,"Seleccione el valor", {
                'campo': idcampo
            });
        });
    },

    chageRequerido: function (id, requerido){
        TML.ajax({
            url: urls.chageRequerido,
            data: {
                id: id,
                requerido: requerido,
            },
            lockContainer: false
        });
    },
    //endregion

    //region Campo valor
    loadCamposValores: function (page= 1){
        var idcampo = $('#input_idcampo').val();
        TML.ajax({
            url: urls.loadCamposValores,
            data:{
                page: page,
                idcampo: idcampo,
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_valores').html(response);
                TableManager.initTable('#list_valores', CamposManager.loadCamposValores);
                CamposManager._initEvents();
            }
        });
    },

    loadCampoValor: function (id, idcampo){
        TML.ajax({
            url: urls.loadCampoValor,
            data: {
                id: id,
                idcampo: idcampo
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalAuxContainer(response);
                $('#modal_valor').modal('show');
                CamposManager._initEvents();
            }
        });
    },

    saveCampoValor: function (){
        var form_valor = $('#form_valor');
        if(form_valor.valid()){
            TML.ajax({
                url: urls.saveCampoValor,
                data: form_valor.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    CamposManager.loadCamposValores();
                    $('#modal_valor').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }

    },

    deleteCampoValor: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteCampoValor,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_valor'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },
    //endregion
}



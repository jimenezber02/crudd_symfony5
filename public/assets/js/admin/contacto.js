var ContactoManager = {

    urls: null,

    init: function(urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function(){
        $('[data-action="loadContacto"]').off('click').on('click', function () {
            var id = $(this).data('id');
            var target = $(this).data('target');
            var idtarget = $(this).data('idtarget');
            ContactoManager.loadContacto(id, target, idtarget);
        });

        $('[data-action="saveContacto"]').off('click').on('click', function () {
            ContactoManager.saveContacto();
        });

        $('[data-action="deleteContacto"]').off('click').on('click', function () {
            var id = $(this).data('id');
            ContactoManager.deleteContacto(id);
        });

        $('[data-action="enterFindContacto"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                ContactoManager.loadContactos();
            }
        });

        $('[data-action="findContacto"]').off('click').on('click', function () {
            ContactoManager.loadContactos();
        });
    },

    loadContactos: function (page= 1){
        var form_search_contacto = $('#form_search_contacto');
        TML.ajax({
            url: ContactoManager.urls.loadContactos,
            data: form_search_contacto.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_contactos').html(response);
                TableManager.initTable('#list_contacto', ContactoManager.loadContactos);
                ContactoManager._initEvents();
            }
        });
    },

    loadContacto: function (id, target, idtarget){
        TML.ajax({
            url: ContactoManager.urls.loadContacto,
            data: {
                id: id,
                target: target,
                idtarget: idtarget,
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalAuxContainer(response);
                $('#modal_contacto').modal('show');
                ContactoManager._initEvents();
            }
        });
    },

    saveContacto: function (){
        var form_contacto = $('#form_contacto');
        if(form_contacto.valid()){
            TML.ajax({
                url: ContactoManager.urls.saveContacto,
                data: form_contacto.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    ContactoManager.loadContactos();
                    $('#modal_contacto').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }

    },

    deleteContacto: function (id){
        TML.confirm(function (){
            TML.ajax({
                url: ContactoManager.urls.deleteContacto,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_contacto'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },
}



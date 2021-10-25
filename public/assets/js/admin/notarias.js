var NotariaManager = {

    urls: null,

    init: function (urls) {
        this.urls = urls;
        this._initEvents();
        this.initSelect2Notaria($('#ciudad'));
        this.initSelect2Notaria($('#formCiudad'));
    },

    _initEvents: function () {
        $('[data-action="loadNotaria"]').off('click').on('click', function () {
            var id = $(this).data('id');
            NotariaManager.loadNotaria(id);
        });
        $('[data-action="saveNotaria"]').off('click').on('click', function () {
            NotariaManager.saveNotaria();
        });
        $('[data-action="enterFindNotaria"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                NotariaManager.loadNotarias();
            }
        });
        $('[data-action="enterFindCircuito"]').off('keyup').on('keyup', function (e) {
            if (e.keyCode == 13) {
                NotariaManager.loadNotarias();
            }
        });
        $('[data-action="findNotaria"]').off('click').on('click', function () {
            NotariaManager.loadNotarias();
        });
        $('[data-action="deleteNotaria"]').off('click').on('click', function () {
            var id = $(this).data('id');
            NotariaManager.deleteNotaria(id);
        });

        $('[data-action="loadContactos"]').off('click').on('click', function () {
            ContactoManager.loadContactos();
        });
    },


    loadNotaria: function (id){
        TML.ajax({
            url: urls.loadNotaria,
            data: {
                id: id
            },
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);

                $('#modal_notaria').modal('show');
                $('body').on('shown.bs.modal','#modal_notaria', function () {
                    NotariaManager.initSelect2Notaria($('#formCiudad'));
                });
                FormFielsManager.initDecimalFields();
                NotariaManager._initEvents();
            }
        });
    },
    loadNotarias: function (page= 1){
        var form_search_notarias = $('#form_search_Notaria');
        TML.ajax({
            url: urls.loadNotarias,
            data: form_search_notarias.serialize()+'&page='+page,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){
                $('#container_notarias').html(response);
                KTApp.initBootstrapTooltips();
                TableManager.initTable('#table_notarias', NotariaManager.loadNotarias);
                NotariaManager._initEvents();
            }
        });
    },
    saveNotaria: function (){
        var form_notaria = $('#form_notaria');

        if(form_notaria.valid()){
            TML.ajax({
                url: urls.saveNotaria,
                data: form_notaria.serialize(),
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    NotariaManager.loadNotarias();
                    $('#modal_notaria').modal('hide');
                    TML.showSuccess();
                }
            });
        }else{
            TML.showErrorValidacion();
        }
    },
    initSelect2Notaria: function (campo)
    {
       var id = campo.data('idselect');
       var text = campo.data('textselect');
        campo.select2({
            ajax: {
                url: NotariaManager.urls.ajaxLoadSelect,
                dataType: 'json',
                delay: 250,
                method: "POST",
                data: function (params) {
                    return {
                        search: params.term, // search term
                        page: params.page,
                        type: 'public'
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: false
            }
        });
        if(id){
            var newOption = new Option(text, id, true, true);
            campo.append(newOption).trigger('change');
        }
    },
    deleteNotaria: function (id){
        var txt;
        TML.confirm(function (){
            TML.ajax({
                url: urls.deleteNotaria,
                data: {
                    id: id
                },
                lockContainer: true,
                checkResponse: true,
                callback: function(response){
                    $('#tr_notaria'+id).remove();
                    TML.showSuccess();
                }
            });
        });
    },
}


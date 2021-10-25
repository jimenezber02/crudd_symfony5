var TableManager = {

    initTable: function (target, callback, parameters = [], urlsortable = null) {
        $(target).find('.page_control').on('click', function () {
            var page = $(this).data('page');
            callback(page, parameters);
        });

        if($(target).find('[data-sortable="true"]').length){
            $(target).find('[data-sortable="true"]').sortable({
                stop: function( event, ui ) {
                    var ids = [];
                    $(this).find('tr').each(function (index,elemt) {
                        ids.push($(elemt).data('sortable_id'));
                    });
                    TML.ajax({
                        url: urlsortable,
                        data: {
                            ids: ids
                        },
                        lockContainer: true,
                        checkResponse: true,
                        callback: function(response){

                        }
                    });
                }
            });
        }
    },

};

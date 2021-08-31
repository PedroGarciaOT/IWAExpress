$.fn.UserCards = function (options) {
    return this.each(function (index, el) {

        var defaults = $.extend({
            userid: "",
            limit: 3
        });

        options = $.extend(defaults, options);
        var userid = options.userid;
        var limit = options.limit;
        var $data = $(this)
        _getUserCards(userid).then(response => {
            if (response.length) {
                $.each(response, function (i, row) {
                    let card = _cardDiv(row);
                    $data.append(card);
                });
            } else {
                $data.append("<div class='col-12 text-center'>No payment cards found</div>");
            }
        });
    });

    function _cardDiv(card) {
        return (
            '<label class="col-sm-12 col-form-label">' + 
                '<i class="fas fa-credit-card fa-fw"></i>&nbsp;' +
                card.issuer + ' <em>' + card.number + '</em> (expires ' + card.expiryMonth + '/' + card.expiryYear + ')' + 
            '</label>'
        );
    }

    async function _getUserCards(userid) {
        return await $.get(`/api/cards?account=${userid}`).then();
    }

};
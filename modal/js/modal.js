/*
 Copyright © 2013 Intel Corporation. All rights reserved
 */
(function($) {

    'use strict';
    window.uib_modal = {};

    /**
     *  @exports uib_modal.open_pop_up(domNode_query, completef)
     */

    /**
     * toggle_pop_up
     * @param domNode_query -- a single jQuery wrapped domNode
     * @param options - object of modal options
     */
    uib_modal.open_pop_up = function(domNode_query, options)
    {
        domNode_query.modal(options);
    };

    function initialize_modals()
    {
        $("[data-trigger]").each(function()
        {
            var this_query = $(this);
            var data_trigger = this_query.attr("data-trigger");
            var pop = data_trigger.search("popup") != -1;
            if(pop){
                var reg = new RegExp(/([^/]*)\/(\S*)/g);
                var match = reg.exec(data_trigger); // ["pop_up/uib_w_1", "pop_up", "uib_w_1"]
                var f_map = {"popup-togl":uib_modal.open_pop_up, "popup-bool":uib_modal.open_pop_up};
                var proceedf = function(match)               //while(match) --while is not usable because f gets changed
                {
                    var f = f_map[match[1].trim()];
                    var pop_up_query = $("." + match[2].trim());
                    var options = {
                        backdrop: pop_up_query.attr("data-backdrop") === "true" ? true : pop_up_query.attr("data-backdrop") === "false" 
                            ? false : "static",
                        keyboard: pop_up_query.attr("data-keyboard") === "true" ? true : false
                    };
                    if(pop_up_query.length > 0)
                    {
                        this_query.click(function(){ f(pop_up_query, options); });
                    }
                    match = reg.exec(data_trigger);
                    if(match){ proceedf(match); }
                };
                proceedf(match);
            }
        });
    }

    //INIT
    $(document).ready(initialize_modals);

})(window.jQuery);
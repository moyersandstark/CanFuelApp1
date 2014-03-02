(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
         $("#lblCityFuelConsumption").click(function(evt)
        {
        /* your code goes here */ 
        });
        $("#btnCompare").click(function(evt)
        {
         /* Other options: .modal("show")  .modal("hide")  .modal("toggle")
         See full API here: http://getbootstrap.com/javascript/#modals 
            */
        
         $("#bs-modal-0").modal("toggle");  
        });
}
 $(document).ready(register_event_handlers);
})();

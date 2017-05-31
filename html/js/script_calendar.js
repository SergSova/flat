ng.ready( function() {
    // creating the calendar
    var my_drag_cal = new ng.Calendar({
        input:'my_drag_select_cal',
        num_months:4,
        weekend:[0,6],
        num_col:2,
        multi_selection:true
    });
    
    // in order to highlight the dates the user
    // drag over, we need to create a div to hold
    // the css style
    my_drag_cal.p.style_div = ng.create('div', {
        styles:{
            display:'none'
        }
    });
    
    // appending the div to the object
    my_drag_cal.get_object().append_element(my_drag_cal.p.style_div);
    
    // blocking the user from selecting text
    ng.get('cal_td'+my_drag_cal.get_id()).set_styles({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-o-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    }).
    // adding the mouse event to allow mouse drag selection
    add_events({
        'mousedown': function(evt){
            // to allow only one selected range, uncomment the line below
            // this.clear_selection();
            
            // getting the td that triggered the event
            var td = evt.src_element;
            
            // if it's a selectable date
            if (td.has_class(this.p.css_prefix+'selectable')) {
                // capture the date
                this.p.mouse_down_date = evt.src_element.get('rel');
            }
        }.bind(my_drag_cal),
        
        'mouseup': function(evt){
            // getting the td that triggered the event
            var td = evt.src_element;
            
            // if the date is selectable and
            // the mouse down event was triggered
            if ((td.has_class(this.p.css_prefix+'selectable'))
                && (ng.defined(this.p.mouse_down_date))) {
                // stop the event
                evt.stop();
                
                // getting the dates for the range
                var dt1 = new Date().from_string(this.p.mouse_down_date);
                var dt2 = new Date().from_string(evt.src_element.get('rel'));
                
                // if the first date is larger than the second, switch them
                if (dt1.getTime() > dt2.getTime()) {
                    var dtx = dt2;
                    dt2 = dt1;
                    dt1 = dtx;
                }
                
                // caching the selected status for both dates
                // to check if the user is selecting or unselecting
                // the dates
                var dt1_selected = this.is_selected(dt1);
                var dt2_selected = this.is_selected(dt2);
                
                // array to hold the dates to select
                var arr = [];
                // adds the dates to select to the array
                while (dt1.getTime() <= dt2.getTime()) {
                    arr.push(dt1);
                    // clone the date (to avoid conflict) and move one day
                    dt1 = dt1.clone().from_string('today + 1');    
                }
                // make sure the second date is selected
                arr.push(dt2);
                
                // check if the user is trying to select or unselect
                if (dt1_selected && dt2_selected){
                    // removing the unselection
                    this.unselect_date(arr);
                }
                else {
                    // select the array of dates
                    this.select_date(arr);
                }
            }
            
            // clear the mouse down date
            this.p.mouse_down_date = null;
            
            // remove any styles from dragging
            this.p.style_div.innerHTML = '';
        }.bind(my_drag_cal),
        
        'mousemove': function(evt){
            // getting the td that triggered the event
            var td = evt.src_element;
            
            // if the date is selectable and
            // the mouse down event was triggered
            if ((td.has_class(this.p.css_prefix+'selectable')) && (ng.defined(this.p.mouse_down_date))) {
                
                // getting the dates for the range
                var dt1 = new Date().from_string(this.p.mouse_down_date);
                var dt2 = new Date().from_string(evt.src_element.get('rel'));
                
                // if the first date is larger than the second, switch them
                if (dt1.getTime() > dt2.getTime()) {
                    var dtx = dt2;
                    dt2 = dt1;
                    dt1 = dtx;
                }
                
                // array to hold the styles selectors
                var style = [];
                // add all the dates for CSS styling
                while (dt1.getTime() <= dt2.getTime()) {
                    style.push('.ng_cal_selectable.ng_cal_date_'+((dt1.getMonth()+1)+'_'+dt1.getDate()+'_'+dt1.getFullYear()));
                    dt1.from_string('today + 1');
                }
                
                // make sure the last date is in the style array
                style.push('.ng_cal_selectable.ng_cal_date_'+((dt2.getMonth()+1)+'_'+dt2.getDate()+'_'+dt2.getFullYear()));
                
                // create the CSS style for the highlighted dates
                this.p.style_div.innerHTML = '<style>'+style.join()+'{background:#faedd6; border:dotted #999999 1px;}</style>';
            }
        }.bind(my_drag_cal),
        
        // make sure the click event doesn't
        // trigger a select date
        'click': function(evt){
            evt.stop();
            this.p.style_div.innerHTML = '';
        }
    });
});



//  function ng () {
//     var my_basic_cal = new ng.Calendar({
//         input: 'date1',            // the input field id
//         start_date: 'last year',   // the start date (default is today)
//         end_date: 'year + 5',      // the end date (related to start_date, 4 years from today)
//         display_date: new Date()   // the display date (default is start_date)
//     });
    
// };

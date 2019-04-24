 ExecuteOrDelayUntilScriptLoaded(init, 'sp.js');
 var currentUser;
 var targetUser;





 function init() {
     this.clientContext = new SP.ClientContext.get_current();
     this.oWeb = clientContext.get_web();
     currentUser = this.oWeb.get_currentUser();
     this.clientContext.load(currentUser);
     this.clientContext.executeQueryAsync(Function.createDelegate(this, this.onLoad));
 }





 function onLoad() {
     var account = currentUser.get_loginName();
     targetUser_temp = account.substring(account.indexOf("|") + 10);
     targetUser = targetUser_temp;

     // FOR TRACING PROBLEMS TO SHOW SHAREPOINT DEFAULT TABLE
     if (targetUser === "junreyd") {
         $('#scriptWPQ2').attr('style', 'display:block !important');
     }

     if (targetUser === "junreyd" || targetUser === "jossiem" || targetUser === "nena.a" || targetUser === "victors" || targetUser === "matttemp" || targetUser === "mattm" || targetUser === "artems" || targetUser === "nowmarc" || targetUser === "litoa" || targetUser === "bernalynv") {
         $(".ms-webpart-zone.ms-fullWidth").show();
     } else {
         $(".ms-webpart-zone.ms-fullWidth").hide();
         alert("Opps! You have no permission on this page.");
         return false;
     }

     var date = new Date();
     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     var date_monthNow = months[date.getMonth()];
     var date_yearNow = '' + date.getFullYear();

     $("#span_year").text("Year: " +
         date_yearNow);


     $.ajax({
         url: _spPageContextInfo.webAbsoluteUrl +
             "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items",
         method: "GET",
         headers: {
             "accept": "application/json;odata=verbose",
             "content-type": "application/json;odata=verbose"
         },

         success: function (data) {
             enps_data = data.d.results;

             var result = {};
             for (var i = 0; i < enps_data.length; i++) {

                 var item = enps_data[i];
                 for (var key in item) {
                     if (!(key in result))
                         result[key] = [];
                     result[key].push(item[key]);
                 }

             }

             var years = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

             //  Chart
             var ctx = document.getElementById("myChart");
             var myChart = new Chart(ctx, {
                 type: 'line',
                 data: {
                     labels: years,
                     datasets: [{
                             data: result.Detractors,
                             label: "Detractors",
                             borderColor: '#F12121',
                             fill: true
                         },
                         {
                             data: result.Passives,
                             label: "Passives",
                             borderColor: '#FCBA02',
                             fill: true
                         },
                         {
                             data: result.Promoters,
                             label: "Promoters",
                             borderColor: '#007300',
                             fill: true
                         }
                     ]
                 },
                 options: {
                     legend: {
                         display: true,
                         labels: {
                             usePointStyle: true,
                         }
                     },
                     responsive: true,
                     maintainAspectRatio: false,
                     scales: {
                         yAxes: [{
                             ticks: {
                                 precision: 0,
                                 beginAtZero: true,
                             }
                         }]
                     },
                     tooltips: {
                         mode: 'index',
                         intersect: false,
                     },
                     hover: {
                         mode: 'nearest',
                         intersect: true
                     },
                     scales: {
                         xAxes: [{
                             display: true,
                             scaleLabel: {
                                 display: true,
                             }
                         }],
                         yAxes: [{
                             display: true,
                             scaleLabel: {
                                 display: true,
                             },
                         }]
                     }
                 }
             });

             var ctx = document.getElementById("myChart");

             //  Pie Chart
             enps_data.forEach((value, index) => {
                 var Titler = (value.Title === null) ? "" : value.Title;
                 var Dates = (value.Dates === null) ? "" : value.Dates;
                 var Year = (value.Year === null) ? "" : value.Year;
                 var Feedback = (value.Feedback === null) ? "" : value.Feedback;
                 var Rate = (value.Rate === null) ? "" : value.Rate;

                 var total_responses = (value.Total_x0020_Responses === null) ?
                     "" :
                     value.Total_x0020_Responses;
                 var Detractors = (value.Detractors === null) ? "" : value.Detractors;
                 var Passives = (value.Passives === null) ? "" : value.Passives;
                 var Promoters = (value.Promoters === null) ? "" : value.Promoters;

                 var ENPS_x0020_Actual_x0020_Score = (value
                     .ENPS_x0020_Actual_x0020_Score === null) ? "" : value.ENPS_x0020_Actual_x0020_Score;


                 var percent_detractor = parseFloat((Detractors / total_responses) * 100).toFixed(2);
                 var percent_detr_validate = (isNaN(percent_detractor)) ? "" : percent_detractor + "%";
                 var percent_promoters = parseFloat((Promoters / total_responses) * 100).toFixed(2);
                 var percent_prom_validate = (isNaN(percent_promoters)) ? "" : percent_promoters + "%";

                 var actual_score = parseFloat(percent_promoters - percent_detractor).toFixed(2);
                 var act_score = (isNaN(actual_score)) ? "" : actual_score + "%";
                 var gauge_actual_score = parseFloat(percent_promoters - percent_detractor).toFixed(2);
                 var numb = Number(gauge_actual_score);

                 if (value.Title == date_monthNow) {
                     //  gauge chart

                     calculateGaugeHeight();

                     // And make sure the height is re-calculated on window resize
                     $(window).on('load resize', function () {
                         calculateGaugeHeight();
                     });

                     var settings = {
                         gaugeMinValue: -100,
                         gaugeMaxValue: 100,
                         gaugeStartValue: numb,
                         gaugeStartAngle: -90,
                         gaugeEndAngle: 90,
                         gaugeUpdateInterval: 500 // ms
                     };

                     var options = {
                         tooltip: {
                             enabled: false
                         },
                         chart: {
                             type: 'gauge',
                             backgroundColor: 'rgba(255, 255, 255, 0)',
                             plotBackgroundColor: null,
                             plotBackgroundImage: null,
                             plotBorderWidth: 0,
                             plotShadow: false,
                             spacing: [5, 30, 5, 30],
                             style: {
                                 fontSize: '1em'
                             }
                         },

                         title: false,

                         pane: {
                             startAngle: settings.gaugeStartAngle,
                             endAngle: settings.gaugeEndAngle,
                             background: {
                                 backgroundColor: 'rgba(255, 255, 255, 0)',
                                 borderWidth: 0,
                                 innerRadius: '60%',
                                 outerRadius: '100%',
                                 shape: 'arc'
                             }
                         },

                         plotOptions: {
                             gauge: {
                                 /*dial: {
                                   radius: 0
                                 },
                                 pivot: {
                                   radius: 0
                                 },*/
                                 dataLabels: {
                                     borderWidth: 0,
                                     padding: 0,
                                     verticalAlign: 'middle',
                                     style: false,
                                     formatter: function () {
                                         var output = '<div class="gauge-data">';
                                         output += '<span class="gauge-value">' + this.y + '</span>';
                                         output += '</div>';

                                         return output;
                                     },
                                     useHTML: true
                                 }
                             },
                             pie: {
                                 dataLabels: {
                                     enabled: true,
                                     distance: -10,
                                     style: false
                                 },
                                 startAngle: settings.gaugeStartAngle,
                                 endAngle: settings.gaugeEndAngle,
                                 center: ['50%', '50%'],
                                 states: {
                                     hover: {
                                         enabled: false
                                     }
                                 }
                             }
                         },

                         // the value axis
                         yAxis: {
                             offset: 10,
                             min: settings.gaugeMinValue,
                             max: settings.gaugeMaxValue,

                             title: false,

                             minorTickWidth: 0,

                             tickPixelInterval: 30,
                             tickWidth: 2,
                             tickPosition: 'outside',
                             tickLength: 14,
                             tickColor: '#ccc',
                             lineColor: '#ccc',
                             labels: {
                                 distance: 28,
                                 rotation: "0",
                                 step: 2,
                             },

                             plotBands: [{
                                 thickness: 10,
                                 outerRadius: "112%",
                                 from: -100,
                                 to: 30,
                                 color: '#FB8585' // red
                             }, {
                                 thickness: 10,
                                 outerRadius: "112%",
                                 from: 30,
                                 to: 70,
                                 color: '#F9E7AE' // yellow,
                             }, {
                                 thickness: 10,
                                 outerRadius: "112%",
                                 from: 70,
                                 to: 100,
                                 color: '#83DAD9' // green
                             }]
                         },

                         series: [{
                             type: 'gauge',
                             data: [settings.gaugeStartValue],
                         }, {
                             type: 'pie',
                             innerSize: '100%',
                             data: [{
                                 y: settings.gaugeStartValue,
                                 name: "",
                                 color: "#0bbeba"
                             }, {
                                 y: settings.gaugeMaxValue - settings.gaugeStartValue,
                                 name: '',
                                 color: "#666666"
                             }]
                         }],

                         navigation: {
                             buttonOptions: {
                                 enabled: false
                             }
                         },

                         credits: false
                     };

                     $('#gauge1').highcharts(options);

                 }



                 //  table display ENPS 

                 if (Feedback !== "") {

                     $("#soflow").append(`
                      <option value="${Dates}">${Dates}</option>`);

                     $("#enps_feedback_table").append(`
                           <tr class='cont'>
                           <td style="display:none;">${Dates}</td>
                         <td class="tdbreak"><i><span style="color: blue;">~:</span></i> ${Feedback}</td>
                         <td>${Rate}</td>
                     </tr>
                          `);
                     //  $("#tr_no_available").hide();
                     //  console.log("true");

                 } else if (Feedback === "") {
                     //  console.log("false");
                     //  $("#tr_no_available").show();
                 }
                 $("#soflow option").each(function (idx, val) {
                     $(this).siblings("[value='" + $(this).val() + "']").remove();
                 });

                 $('#soflow option:eq(' + date_monthNow + ')').attr('selected', true);


                 var num_rows = $("#enps_table > tr").length;

                 if (num_rows > 11) return;
                 $("#enps_table").append(`
                 <tr>
                <td style="border: 1px solid #ddd;">${Titler}</td>
                <td>${Detractors}</td>
                <td>${Passives}</td>
                <td>${Promoters}</td>
                <td>${total_responses}</td>
               
               <td class="per" style="border: 1px solid #ddd;" >${percent_detr_validate}</td>
               <td class="per" style="border: 1px solid #ddd;" >${percent_prom_validate}</td>
                <td>${act_score}</td>

            </tr>
                    `);
             });

         },
         //  <td class="per" style="border: 1px solid #ddd;" >${percent_validate}</td>
         error: function (error) {
             console.log(JSON.stringify(error));
         }
     });


     function calculateGaugeHeight() {
         var div = $('.gauge');
         div.height(div.width());
     }
 }




 function filterTextv2() {
     var rex = new RegExp($('#soflow').val());
     console.log(rex);

     if (rex == "//") {
         clearFilter()
     } else {
         $('.cont').hide();
         $('.cont').filter(function () {
             return rex.test($(this).text());
         }).show();
     }
 }





 function clearFilter() {
     //  $('.filterText').val('');
     $('.cont').show();
 }






 //  function showFeedback() {
 //      $('#default_view_id').show();
 //      $('#feedback_id').hide();
 //      $('#feedback_results1 tbody').empty();
 //      $.ajax({
 //          url: _spPageContextInfo.webAbsoluteUrl +
 //              "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items",
 //          method: "GET",
 //          headers: {
 //              "accept": "application/json;odata=verbose",
 //              "content-type": "application/json;odata=verbose"
 //          },

 //          success: function (data) {
 //              enps_data = data.d.results;

 //              $.each(enps_data, function (index, value) {

 //                  var Feedback = (value.Feedback === null) ? "" : value.Feedback;


 //                  $('#feedback_results1 tbody').append(`
 //                 <tr>
 //                     <td class="feedback_td">${Feedback}</td>
 //                 </tr>`);
 //              });

 //              $('#data_results1').hide();
 //              $("td:empty").remove();
 //              $('#feedback_results1').show();

 //          },

 //          error: function (error) {
 //              console.log(JSON.stringify(error));
 //          }
 //      });

 //  }

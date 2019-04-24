ExecuteOrDelayUntilScriptLoaded(init, 'sp.js');
var currentUser;
var targetUser;
var date = new Date();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var date_monthNow = months[date.getMonth()];
var date_yearNow = '' + date.getFullYear();


// console.log(typeof (date_yearNow));



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

    var for_validation = function () {
        return $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items?$select=Surveyor,Dates,Year",
            method: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose"
            },

            success: function (data) {},

            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });

    }

    for_validation().done(function (data) {
        var res = data.d.results;

        res.forEach((value, index) => {
            if (index < 12) return;

            if (value.Surveyor === targetUser) {

                if (value.Dates === date_monthNow && value.Year === date_yearNow) {
                    $("button[id*='submit_survey_id']").prop("disabled", true);
                    $("button[id*='submit_survey_id']").html("Survey Done!");
                    $("button[id*='submit_survey_id']").addClass('disabled');

                }

            }


        });

    });

}


(function () {

    $('.form-radio').click(function () {
        // $('input[name=radiobtn]').attr("disabled", true);
        var check = $("input[name='radiobtn']:checked").val();
        if (check == 1 || check == 2 || check == 3 || check == 4 || check == 5 || check == 6 || check == 7 || check == 8 || check == 9 || check == 10) {
            $("#answer").show();
            $("#feedbackID").show();
            $("#answer_number").text(check);

        } else {
            $("#answer").hide();
            $("#feedbackID").hide();
        }
    });


})();



function post_survey() {

    var radio_value = $("input[name='radiobtn']:checked").val();
    var feedbackID = $("input[id='feedbackID']").val();
    console.log(feedbackID);


    if (feedbackID === "") {
        alert("Please input your answer!");
        return false;
    } else {

        $('#loader_show_hide').show();
        var send_feedback = function () {
            return $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items",
                method: "POST",
                data: JSON.stringify({
                    '__metadata': {
                        'type': 'SP.Data.ENPS_x0020_Survey_x0020_and_x0020_ReportListItem'
                    },
                    'Feedback': feedbackID,
                    'Surveyor': targetUser,
                    'Dates': date_monthNow,
                    'Year': date_yearNow,
                    'Rate': radio_value
                }),
                headers: {
                    "accept": "application/json;odata=verbose", //It defines the Data format   
                    "content-type": "application/json;odata=verbose", //It defines the content type as JSON  
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },

                success: function (data) {},

                error: function (error) {
                    console.log(JSON.stringify(error));
                }



            });
        }

        send_feedback().done(function () {

            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items",
                method: "GET",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose"
                },

                success: function (data) {
                    var enps_data = data.d.results;

                    $.each(enps_data, function (index, value) {

                        var months = value.Title;
                        var id = value.Id;
                        var total_responses = Number(value.Total_x0020_Responses + 1)
                        var detractors = Number(value.Detractors + 1);
                        var passives = Number(value.Passives + 1);
                        var promoters = Number(value.Promoters + 1);

                        if ((months === date_monthNow) && (radio_value === '1' || radio_value === '2' || radio_value === '3' ||
                                radio_value === '4' || radio_value === '5' || radio_value === '6')) {
                            var enps_actual_score = Number(value.ENPS_x0020_Actual_x0020_Score - 1);

                            $.ajax({
                                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items('" + id + "')",
                                method: "POST",
                                data: JSON.stringify({
                                    '__metadata': {
                                        'type': 'SP.Data.ENPS_x0020_Survey_x0020_and_x0020_ReportListItem'
                                    },
                                    'Total_x0020_Responses': total_responses,
                                    'Detractors': detractors,
                                    'ENPS_x0020_Actual_x0020_Score': enps_actual_score
                                }),
                                headers: {
                                    "accept": "application/json;odata=verbose", //It defines the Data format   
                                    "content-type": "application/json;odata=verbose", //It defines the content type as JSON  
                                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                    "IF-MATCH": "*",
                                    "X-HTTP-Method": "MERGE"
                                },

                                success: function (data) {
                                    $('#loader_show_hide').hide();
                                    swal({
                                            title: "Successfully submitted",
                                            type: "success"
                                        },
                                        function () {
                                            // location.reload();
                                            $("#survey_form").hide();
                                            $("#note").hide();
                                            $("#thanks").show();
                                        }
                                    );

                                },

                                error: function (error) {
                                    console.log(JSON.stringify(error));
                                }
                            });

                        } else if ((months === date_monthNow) && (radio_value === '7' || radio_value === '8')) {

                            $.ajax({
                                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items('" + id + "')",
                                method: "POST",
                                data: JSON.stringify({
                                    '__metadata': {
                                        'type': 'SP.Data.ENPS_x0020_Survey_x0020_and_x0020_ReportListItem'
                                    },
                                    'Total_x0020_Responses': total_responses,
                                    'Passives': passives,
                                }),
                                headers: {
                                    "accept": "application/json;odata=verbose", //It defines the Data format   
                                    "content-type": "application/json;odata=verbose", //It defines the content type as JSON  
                                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                    "IF-MATCH": "*",
                                    "X-HTTP-Method": "MERGE"
                                },

                                success: function (data) {
                                    $('#loader_show_hide').hide();

                                    swal({
                                            title: "Successfully submitted",
                                            type: "success"
                                        },
                                        function () {
                                            // location.reload();
                                            $("#survey_form").hide();
                                            $("#note").hide();

                                            $("#thanks").show();
                                        }
                                    );
                                },

                                error: function (error) {
                                    console.log(JSON.stringify(error));
                                }
                            });

                        } else if ((months === date_monthNow) && (radio_value === '9' || radio_value === '10')) {
                            var enps_actual_score = Number(value.ENPS_x0020_Actual_x0020_Score + 1);

                            $.ajax({
                                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Employee Satisfaction Score')/items('" + id + "')",
                                method: "POST",
                                data: JSON.stringify({
                                    '__metadata': {
                                        'type': 'SP.Data.ENPS_x0020_Survey_x0020_and_x0020_ReportListItem'
                                    },
                                    'Total_x0020_Responses': total_responses,
                                    'Promoters': promoters,
                                    'ENPS_x0020_Actual_x0020_Score': enps_actual_score
                                }),
                                headers: {
                                    "accept": "application/json;odata=verbose", //It defines the Data format   
                                    "content-type": "application/json;odata=verbose", //It defines the content type as JSON  
                                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                    "IF-MATCH": "*",
                                    "X-HTTP-Method": "MERGE"
                                },

                                success: function (data) {
                                    $('#loader_show_hide').hide();

                                    swal({
                                            title: "Successfully submitted",
                                            type: "success"
                                        },
                                        function () {
                                            // location.reload();
                                            $("#survey_form").hide();
                                            $("#note").hide();

                                            $("#thanks").show();

                                        }
                                    );
                                },

                                error: function (error) {
                                    console.log(JSON.stringify(error));
                                }
                            });
                        }

                    });
                },

                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });

        });


    }




}

// Database details
var DB_NAME = "EMP-DB";
var RELATION_NAME = "EmpData";
var BASE_URL = "http://api.login2explore.com:5577";
var IML = "/api/iml";
var IRL = "/api/irl";
var TOKEN = "90932196|-31949215867291122|90963509";

$(document).ready(function() {
    $("#empid").focus();
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $("#empid").val();
    var jsonStr = {
        id: empid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#empname").val(record.name);
    $("#empsal").val(record.salary);
    $("#hra").val(record.hra);
    $("#da").val(record.da);
    $("#deduct").val(record.deduction);
    enableFields();
}

function resetForm() {
    $("#empid").val("");
    $("#empname").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
    disableFields();
    $("#empid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#empid").focus();
}

function validateData() {
    var empid, empname, empsal, hra, da, deduct;
    empid = $("#empid").val();
    empname = $("#empname").val();
    empsal = $("#empsal").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduct = $("#deduct").val();

    if (empid === "") {
        alert("Employee ID missing");
        $("#empid").focus();
        return "";
    }
    if (empname === "") {
        alert("Employee Name missing");
        $("#empname").focus();
        return "";
    }
    if (empsal === "") {
        alert("Employee Salary missing");
        $("#empsal").focus();
        return "";
    }
    if (hra === "") {
        alert("HRA missing");
        $("#hra").focus();
        return "";
    }
    if (da === "") {
        alert("DA missing");
        $("#da").focus();
        return "";
    }
    if (deduct === "") {
        alert("Deduction missing");
        $("#deduct").focus();
        return "";
    }

    var jsonStrObj = {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}

function enableFields() {
    $("#empname").prop("disabled", false);
    $("#empsal").prop("disabled", false);
    $("#hra").prop("disabled", false);
    $("#da").prop("disabled", false);
    $("#deduct").prop("disabled", false);
}

function disableFields() {
    $("#empname").prop("disabled", true);
    $("#empsal").prop("disabled", true);
    $("#hra").prop("disabled", true);
    $("#da").prop("disabled", true);
    $("#deduct").prop("disabled", true);
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(TOKEN, DB_NAME, RELATION_NAME, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, BASE_URL, IRL);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        enableFields();
        $("#empname").focus();
    } else if (resJsonObj.status === 200) {
        $("#empid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(TOKEN, jsonStrObj, DB_NAME, RELATION_NAME);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, BASE_URL, IML);
    jQuery.ajaxSetup({async: true});
    alert(JSON.stringify(resJsonObj));
    resetForm();
    $("#empid").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(TOKEN, jsonChg, DB_NAME, RELATION_NAME, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, BASE_URL, IML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#empid").focus();
}

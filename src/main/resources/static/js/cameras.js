/**
 * Created by GEORGE RADUTA on 11.02.2015.
 */



// Function which will empty the fields from radiotracer
// Preventing browser cache
function emptyFieldsAddRadioTracer() {
    document.getElementById("nameOfCameraInput").value = "";
    document.getElementById("descriptionOfCameraInput").value="";
    document.getElementById("facilitiesOfCameraInput").value = "";
    document.getElementById("saveCameraButton").disabled = true;
}

function addNewCamera() {
    var table = document.getElementById("tableBodyCameras");
    //Data entered by user
    var nameOfCameraInput = document.getElementById("nameOfCameraInput").value;
    var descriptionOfCameraInput = document.getElementById("descriptionOfCameraInput").value;
    var facilitiesOfCameraInput = document.getElementById("facilitiesOfCameraInput").value;

    //TR
    var cameraTR = document.createElement("tr");
    cameraTR.setAttribute("id", "TR" + nameOfCameraInput);

    //TH ID
    var idOfCamera= document.createElement("th");

    idOfCamera.setAttribute("id", table.rows.length + 1);
    idOfCamera.setAttribute("class", "text-center");
    idOfCamera.innerHTML = "#" + (table.rows.length + 1);

    //TH Name
    var nameOfCamera = document.createElement("th");
    nameOfCamera.setAttribute("id", "TH" + nameOfCameraInput + "Name");
    nameOfCamera.setAttribute("class", "text-center");
    nameOfCamera.innerHTML = nameOfCameraInput;

    //TH Description
    var descriptionOfCamera = document.createElement("th");
    descriptionOfCamera.setAttribute("id","TH" + nameOfCameraInput + "Description");
    descriptionOfCamera.setAttribute("class","text-center");
    descriptionOfCamera.innerHTML = descriptionOfCameraInput;

    //TH Facilities
    var facilitiesOfCamera = document.createElement("th");
    facilitiesOfCamera.setAttribute("id","TH" + nameOfCameraInput + "Facilities");
    facilitiesOfCamera.setAttribute("class","text-center");
    facilitiesOfCamera.innerHTML = facilitiesOfCameraInput;

    //TH
    var editCamera = document.createElement("th");
    editCamera.setAttribute("id","TH" + nameOfCameraInput + "Edit");
    editCamera.setAttribute("class","text-center");
        var ueditCamera = document.createElement("u");
        ueditCamera.setAttribute("class","fa fa-pencil-square-o");
        ueditCamera.setAttribute("id","u" + nameOfCameraInput + "Edit");
        ueditCamera.setAttribute("style","cursor:pointer");
        ueditCamera.setAttribute("onmouseover","this.style.color='#2f2f8b';");
        ueditCamera.setAttribute("onmouseout","this.style.color='';");
        ueditCamera.setAttribute("onclick","editCamera(id)");
        ueditCamera.innerHTML = "Edit";
    editCamera.appendChild(ueditCamera);
    //Add elements to the table
    cameraTR.appendChild(idOfCamera);
    cameraTR.appendChild(nameOfCamera);
    cameraTR.appendChild(descriptionOfCamera);
    cameraTR.appendChild(facilitiesOfCamera);
    cameraTR.appendChild(editCamera);
    table.appendChild(cameraTR);

    document.getElementById("saveCameraButton").setAttribute("data-dismiss", "modal");
}
//Edit Camera
function editCamera(id) {

    //Getting the name of the camera;
    var nameOfCamera = id.replace("u","");
    nameOfCamera = nameOfCamera.replace("Edit","");

    //Opening the modal
    var uToEdit = document.getElementById(id);
    uToEdit.setAttribute("data-backdrop","static");
    uToEdit.setAttribute("data-keyboard","false");
    uToEdit.setAttribute("data-toggle","modal");
    uToEdit.setAttribute("data-target","#bs-example-modal-sm-edit-camera");

    //Filling the modal with the data
    document.getElementById("editNameOfCameraInput").value = nameOfCamera;
    document.getElementById("editDescriptionOfCameraInput").value = document.getElementById("TH" + nameOfCamera + "Description").innerHTML;
    document.getElementById("editFacilitiesOfCameraInput").value = document.getElementById("TH" + nameOfCamera + "Facilities").innerHTML;

    document.getElementById("headEditCamera").innerHTML = "Edit camera " + "<b><u>" + nameOfCamera + "</u></b>";
    document.getElementById("editDeleteCameraButton").setAttribute("name",nameOfCamera);
    document.getElementById("editDeleteCameraButton").setAttribute("onclick","editDeleteCamera(name)");
    document.getElementById("editSaveCameraButton").setAttribute("name",nameOfCamera);
    document.getElementById("editSaveCameraButton").setAttribute("onclick","editSaveCamera(name)");
}
function editSaveCamera(name) {
    console.log("start edit Save camera");
    //Data entered by user
    var nameOfCameraInput = document.getElementById("editNameOfCameraInput").value;
    var descriptionOfCameraInput = document.getElementById("editDescriptionOfCameraInput").value;
    var facilitiesOfCameraInput = document.getElementById("editFacilitiesOfCameraInput").value;
    console.log(nameOfCameraInput);
    //TR
    var cameraTR = document.getElementById("TR" + name);
    cameraTR.setAttribute("id", "TR" + nameOfCameraInput);

    //TH Name
    var nameOfCamera = document.getElementById("TH" + name + "Name");
    nameOfCamera.setAttribute("id", "TH" + nameOfCameraInput + "Name");
    nameOfCamera.innerHTML = nameOfCameraInput;

    //TH Description
    var descriptionOfCamera = document.getElementById("TH" + name + "Description");
    descriptionOfCamera.setAttribute("id","TH" + nameOfCameraInput + "Description");
    descriptionOfCamera.innerHTML = descriptionOfCameraInput;

    //TH Facilities
    var facilitiesOfCamera = document.getElementById("TH" + name + "Facilities");
    facilitiesOfCamera.setAttribute("id","TH" + nameOfCameraInput + "Facilities");
    facilitiesOfCamera.innerHTML = facilitiesOfCameraInput;

    //TH
    var editCamera = document.getElementById("TH" + name + "Edit");
    editCamera.setAttribute("id","TH" + nameOfCameraInput + "Edit");
    var ueditCamera = document.getElementById("u" + name + "Edit");
        ueditCamera.setAttribute("id","u" + nameOfCameraInput + "Edit");
        ueditCamera.setAttribute("style","cursor:pointer");
    document.getElementById("editSaveCameraButton").setAttribute("data-dismiss", "modal");
}

// Delete selected Camera
function editDeleteCamera(name) {
    name = "TH"+name+"Name";
    var rowToDelete = document.getElementById(name);
    console.log(name);
    console.log(rowToDelete);

    rowToDelete.parentNode.remove();
    document.getElementById("editDeleteCameraButton").setAttribute("data-dismiss", "modal");
}
//JQUERY
$("input").keyup(function () {
    var valueNameInput = $("#nameOfCameraInput").val();

    if (valueNameInput != "") {
        $("#saveCameraButton").removeAttr("disabled");
    }
});
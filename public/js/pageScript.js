function deleteRow(excerciseLog,currentRow) {
    try {
        var table = document.getElementById("exerciseLog");
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            /*var chkbox = row.cells[0].childNodes[0];*/
            /*if (null != chkbox && true == chkbox.checked)*/
            
            if (row==currentRow.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

const getData = async () => {
    document.getElementById('submit').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var payload = {longUrl:null};
        req.open('GET', '/input', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            document.getElementById('originalUrl').textContent = response.longUrl;
            document.getElementById('shortUrl').textContent = response.id;
          } else {
            console.log("Error in network request: " + req.statusText);
          }});
        req.send(JSON.stringify(payload));
        event.preventDefault();
      });
};


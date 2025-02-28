$(document).ready(function(){
  $(".boton-login").click(function(e){
    e.preventDefault();
    
    var usuario = $("#usuario").val().trim();
    var contraseña = $("#contraseña").val().trim();
    
    $.ajax({
      url: "http://localhost:3000/api/login",
      method: "GET", 
      data: { usuario: usuario, contraseña: contraseña },
      dataType: "json",
      success: function(response) {
          console.log(response);
          

        if(response.message && response.message.indexOf("Login exitoso") !== -1){
          localStorage.setItem("tipo", response.user.tipo);
          location.replace("home.html");
        } else {
          location.reload();
        }
      },
      error: function(xhr) {
        if (xhr.responseJSON && xhr.responseJSON.error) {
          alert( xhr.responseJSON.error);
        } else {
          alert("Error al iniciar sesión");
        }
      }
    });
  });


  $(".image-pedidos").click(function(e){
    location.replace("pedidos.html");
  });

  $(".image-mesas").click(function(e){
    location.replace("mesas.html");
  });

  $(".logo-name").click(function(e){
    location.replace("home.html");
  });

  $(".logout").click(function(e){
    location.replace("index.html");
  });


});
  
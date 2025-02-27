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
            alert("Login")
          } else {
            alert("Credenciales incorrectas, intenta de nuevo");
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
    $(".boton-registro").click(function(e){
      e.preventDefault();
      
      var usuarioNuevo = $("#usuarioNuevo").val()
      var contraseñaNueva = $("#contraseñaNueva").val()
      var contraseñaNuevaConfirmar = $("#contraseñaNuevaConfirmada").val()
    if(usuarioNuevo){
      if(contraseñaNueva && contraseñaNueva==contraseñaNuevaConfirmar){
        $.ajax({
          url: "http://localhost:3000/api/registro",
          type: "POST",
          contentType: "application/json", 
          data: JSON.stringify({ 
            usuario: usuarioNuevo,
            contraseña: contraseñaNueva,
            tipo:"normal"
          }),
          dataType: "json",
          success: function(response) {
              console.log(response);
              location.replace("index.html")
          },
          error: function(xhr) {
            if (xhr.responseJSON && xhr.responseJSON.error) {
              alert( xhr.responseJSON.error);
            } else {
              alert("Error al iniciar sesión");
            }
          }
        });
      }
      else{
        alert(!usuarioNuevo)
        $("#usuarioNuevo").val("")
        $("#contraseñaNuevaConfirmada").val("")
        $("#contraseñaNueva").val("")
  
      }
    }
    else{
      alert(!usuario)
      $("#usuarioNuevo").val("")
      $("#contraseñaNuevaConfirmada").val("")
      $("#contraseñaNueva").val("")

    }
    });

    $('.registrarme').on('click',function(){
      location.replace('registro.html')
    })
    $('.logear').on('click',function(){
      location.replace('index.html')
    })
});
  
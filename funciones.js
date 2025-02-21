$(document).ready(function(){
    $(".boton-login").click(function(e){
      e.preventDefault();
      
      var usuario = $("#usuario").val().trim();
      var contraseña = $("#contraseña").val().trim();
      
      
      // Enviamos los datos al backend usando $.ajax (método GET en este ejemplo)
      $.ajax({
        url: "https://ejercicio-git-restaurante-back.vercel.app/api/users",
        method: "GET", 
        data: { usuario: usuario, contraseña: contraseña },
        dataType: "json",
        success: function(response) {
            console.log(response);
            

          if(response.message && response.message.indexOf("Login exitoso") !== -1){
            window.location.href = "principal.html";
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
});
  
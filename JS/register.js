
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const mensaje = document.getElementById('mensajeRegistro');

    function mostrarMensaje(texto, tipo = 'error') {
        mensaje.textContent = texto;
        mensaje.className = tipo === 'error' ? 'mensaje-error' : 'mensaje-exito';
        mensaje.style.display = 'block';
        
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 5000);
    }

    function validarNombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
        return regex.test(nombre.trim());
    }

    function validarDNI(dni) {
        const regex = /^\d{8}$/;
        return regex.test(dni.trim());
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    }

    function validarTelefono(telefono) {
        const regex = /^[9]\d{8}$/; 
        return regex.test(telefono.trim());
    }

    function validarDireccion(direccion) {
        return direccion.trim().length >= 5 && direccion.trim().length <= 100;
    }

    function validarCiudad(ciudad) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/;
        return regex.test(ciudad.trim());
    }

    function validarCodigoPostal(codigo) {
        const regex = /^\d{5}$/;
        return regex.test(codigo.trim());
    }

    function validarContrasena(contrasena) {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
        return regex.test(contrasena);
    }

    document.getElementById('nombre').addEventListener('blur', function() {
        if (!validarNombre(this.value)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    document.getElementById('dni').addEventListener('blur', function() {
        if (!validarDNI(this.value)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    document.getElementById('email').addEventListener('blur', function() {
        if (!validarEmail(this.value)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    document.getElementById('telefono').addEventListener('blur', function() {
        if (!validarTelefono(this.value)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    function validarFormulario() {
        const datos = {
            nombre: document.getElementById('nombre').value,
            dni: document.getElementById('dni').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            ciudad: document.getElementById('ciudad').value,
            codigoPostal: document.getElementById('codigoPostal').value,
            contrasena: document.getElementById('contrasena').value
        };

        for (let campo in datos) {
            if (!datos[campo].trim()) {
                mostrarMensaje('Todos los campos son obligatorios');
                return false;
            }
        }

        if (!validarNombre(datos.nombre)) {
            mostrarMensaje('Nombre invalido. Ingrese un nombre valido');
            return false;
        }

        if (!validarDNI(datos.dni)) {
            mostrarMensaje('DNI invalido. Debe tener 8 dígitos');
            return false;
        }

        if (!validarEmail(datos.email)) {
            mostrarMensaje('Email invalido');
            return false;
        }

        if (!validarTelefono(datos.telefono)) {
            mostrarMensaje('Telefono invalido. Debe empezar con 9 y tener 9 dígitos');
            return false;
        }

        if (!validarDireccion(datos.direccion)) {
            mostrarMensaje('Direccion invalida.');
            return false;
        }

        if (!validarCiudad(datos.ciudad)) {
            mostrarMensaje('Ciudad invalida.');
            return false;
        }

        if (!validarCodigoPostal(datos.codigoPostal)) {
            mostrarMensaje('Código postal inválido. Debe tener 5 dígitos');
            return false;
        }

        if (!validarContrasena(datos.contrasena)) {
            mostrarMensaje('Contraseña debe tener mínimo 6 caracteres, una letra y un número');
            return false;
        }

        return datos;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const datos = validarFormulario();
        if (!datos) return;

        const boton = form.querySelector('button[type="submit"]');
        const textoOriginal = boton.textContent;
        boton.textContent = 'Procesando...';
        boton.disabled = true;

        try {
            // Aquí harás la conexión a tu BD
            const response = await fetch('../php/register.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (resultado.success) {
                mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'exito');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                mostrarMensaje(resultado.message || 'Error en el registro');
            }

        } catch (error) {
            mostrarMensaje('Error de conexión. Intenta de nuevo');
            console.error('Error:', error);
        } finally {
            // Restaurar botón
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }
    });
    
});
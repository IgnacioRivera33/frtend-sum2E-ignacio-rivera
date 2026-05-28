// Expresiones regulares y patrones de validación
const patrones = {
  nombre: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^[\d\s+\-()]+$/, // Permite dígitos, espacios, +, -, ()
  dni: /^\d{7,8}$/
};

// Objeto con médicos por especialidad
const medicosPorEspecialidad = {
  'Clinica General': ['Dra. Ana Silva', 'Dr. Marcelo Díaz'],
  'Cardiologia': ['Dr. Luis Pérez', 'Dra. Marcela Torres'],
  'Pediatria': ['Dra. Paula Ramírez', 'Dr. Martín Gómez'],
  'Ginecologia': ['Dra. Laura Aguirre', 'Dra. Soledad Vega'],
  'Traumatologia': ['Dr. Carlos Mendoza', 'Dra. Carla Pineda'],
  'Neurologia': ['Dr. Javier Molina', 'Dra. Natalia Costa']
};

// Funciones de validación individuales
const validaciones = {
  nombre(valor) {
    if (!valor.trim()) return { valido: false, mensaje: 'El nombre es obligatorio' };
    if (!patrones.nombre.test(valor)) {
      return { valido: false, mensaje: 'Solo se permiten letras y espacios' };
    }
    return { valido: true };
  },

  apellido(valor) {
    if (!valor.trim()) return { valido: false, mensaje: 'El apellido es obligatorio' };
    if (!patrones.nombre.test(valor)) {
      return { valido: false, mensaje: 'Solo se permiten letras y espacios' };
    }
    return { valido: true };
  },

  dni(valor) {
    if (!valor.trim()) return { valido: false, mensaje: 'El RUT es obligatorio' };
    if (!patrones.dni.test(valor)) {
      return { valido: false, mensaje: 'El RUT debe contener 7 u 8 dígitos' };
    }
    return { valido: true };
  },

  email(valor) {
    if (!valor.trim()) return { valido: false, mensaje: 'El email es obligatorio' };
    if (!patrones.email.test(valor)) {
      return { valido: false, mensaje: 'Ingrese un email válido' };
    }
    return { valido: true };
  },

  telefono(valor) {
    if (!valor.trim()) return { valido: false, mensaje: 'El teléfono es obligatorio' };
    const soloDigitos = valor.replace(/\D/g, '');
    if (soloDigitos.length < 8) {
      return { valido: false, mensaje: 'El teléfono debe tener al menos 8 dígitos' };
    }
    if (!patrones.telefono.test(valor)) {
      return { valido: false, mensaje: 'Formato de teléfono inválido' };
    }
    return { valido: true };
  },

  nacimiento(valor) {
    if (!valor) return { valido: false, mensaje: 'La fecha de nacimiento es obligatoria' };
    const fecha = new Date(valor);
    const hoy = new Date();

    if (fecha > hoy) {
      return { valido: false, mensaje: 'La fecha de nacimiento no puede ser futura' };
    }

    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }

    if (edad < 0 || edad > 120) {
      return { valido: false, mensaje: 'La edad debe estar entre 0 y 120 años' };
    }

    return { valido: true };
  },

  genero(valor) {
    if (!valor) return { valido: false, mensaje: 'Seleccione un género' };
    return { valido: true };
  },

  especialidad(valor) {
    if (!valor) return { valido: false, mensaje: 'Seleccione una especialidad' };
    return { valido: true };
  },

  medico(valor) {
    if (!valor) return { valido: false, mensaje: 'Seleccione un médico' };
    return { valido: true };
  },

  consulta(valor) {
    if (!valor) return { valido: false, mensaje: 'Seleccione un tipo de consulta' };
    return { valido: true };
  },

  fecha_turno(valor) {
    if (!valor) return { valido: false, mensaje: 'La fecha del turno es obligatoria' };

    const fechaTurno = new Date(valor);
    const ahora = new Date();
    const ahora24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    if (fechaTurno < ahora24h) {
      return { valido: false, mensaje: 'El turno debe tener al menos 24 horas de anticipación' };
    }

    const diaSemana = fechaTurno.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      return { valido: false, mensaje: 'Solo se aceptan turnos de lunes a viernes' };
    }

    return { valido: true };
  },

  hora_turno(valor) {
    if (!valor) return { valido: false, mensaje: 'La hora del turno es obligatoria' };
    const [horas, minutos] = valor.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos;
    const horaApertura = 8 * 60;
    const horaCierre = 20 * 60;

    if (totalMinutos < horaApertura || totalMinutos > horaCierre) {
      return { valido: false, mensaje: 'El horario debe ser entre 08:00 y 20:00' };
    }

    return { valido: true };
  },

  modalidad(valor) {
    if (!valor) return { valido: false, mensaje: 'Seleccione una modalidad' };
    return { valido: true };
  },

  plataforma(valor, modalidad) {
    if (modalidad === 'Videoconsulta' && !valor) {
      return { valido: false, mensaje: 'Seleccione una plataforma para videoconsulta' };
    }
    return { valido: true };
  },

  cobertura(valor) {
    if (!valor) return { valido: false, mensaje: 'Seleccione una cobertura' };
    return { valido: true };
  },

  credencial(valor, cobertura) {
    if (cobertura !== 'Particular' && !valor.trim()) {
      return { valido: false, mensaje: 'El número de credencial es obligatorio' };
    }
    if (cobertura !== 'Particular' && valor.trim().length < 5) {
      return { valido: false, mensaje: 'El número de credencial debe tener al menos 5 caracteres' };
    }
    return { valido: true };
  },

  plan(valor, cobertura) {
    if (cobertura !== 'Particular' && !valor.trim()) {
      return { valido: false, mensaje: 'El plan es obligatorio' };
    }
    return { valido: true };
  },

  como_nos_conocio(valor, primeraVisita) {
    if (primeraVisita && !valor) {
      return { valido: false, mensaje: 'Seleccione cómo nos conoció' };
    }
    return { valido: true };
  },

  motivo(valor) {
    if (!valor.trim()) return { valido: false, mensaje: 'El motivo de consulta es obligatorio' };
    if (valor.trim().length < 20) {
      return { valido: false, mensaje: 'El motivo debe tener al menos 20 caracteres' };
    }
    return { valido: true };
  },

  descripcion_estudios(valor, tieneEstudios) {
    if (tieneEstudios && !valor.trim()) {
      return { valido: false, mensaje: 'La descripción de estudios es obligatoria' };
    }
    if (tieneEstudios && valor.trim().length < 20) {
      return { valido: false, mensaje: 'La descripción debe tener al menos 20 caracteres' };
    }
    return { valido: true };
  }
};

// Función para mostrar error en un campo
function mostrarError(elemento, mensaje) {
  elemento.classList.remove('campo-ok');
  elemento.classList.add('campo-error');

  let errorDiv = elemento.parentElement.querySelector('.mensaje-error');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'mensaje-error';
    elemento.parentElement.appendChild(errorDiv);
  }
  errorDiv.textContent = mensaje;
}

// Función para mostrar éxito en un campo
function mostrarOk(elemento) {
  elemento.classList.remove('campo-error');
  elemento.classList.add('campo-ok');

  const errorDiv = elemento.parentElement.querySelector('.mensaje-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Función para limpiar estados
function limpiarEstados(elemento) {
  elemento.classList.remove('campo-ok', 'campo-error');
  const errorDiv = elemento.parentElement.querySelector('.mensaje-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Función principal de validación del formulario
function validarFormulario(event) {
  event.preventDefault();

  const form = document.getElementById('turnoForm');
  let formularioValido = true;
  let primerCampoInvalido = null;

  // Datos del paciente
  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const dni = document.getElementById('dni');
  const email = document.getElementById('email');
  const telefono = document.getElementById('telefono');
  const nacimiento = document.getElementById('nacimiento');
  const genero = document.getElementById('genero');

  // Validar nombre
  const resultNombre = validaciones.nombre(nombre.value);
  if (!resultNombre.valido) {
    mostrarError(nombre, resultNombre.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = nombre;
  } else {
    mostrarOk(nombre);
  }

  // Validar apellido
  const resultApellido = validaciones.apellido(apellido.value);
  if (!resultApellido.valido) {
    mostrarError(apellido, resultApellido.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = apellido;
  } else {
    mostrarOk(apellido);
  }

  // Validar DNI
  const resultDni = validaciones.dni(dni.value);
  if (!resultDni.valido) {
    mostrarError(dni, resultDni.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = dni;
  } else {
    mostrarOk(dni);
  }

  // Validar email
  const resultEmail = validaciones.email(email.value);
  if (!resultEmail.valido) {
    mostrarError(email, resultEmail.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = email;
  } else {
    mostrarOk(email);
  }

  // Validar teléfono
  const resultTelefono = validaciones.telefono(telefono.value);
  if (!resultTelefono.valido) {
    mostrarError(telefono, resultTelefono.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = telefono;
  } else {
    mostrarOk(telefono);
  }

  // Validar fecha de nacimiento
  const resultNacimiento = validaciones.nacimiento(nacimiento.value);
  if (!resultNacimiento.valido) {
    mostrarError(nacimiento, resultNacimiento.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = nacimiento;
  } else {
    mostrarOk(nacimiento);
  }

  // Validar género
  const resultGenero = validaciones.genero(genero.value);
  if (!resultGenero.valido) {
    mostrarError(genero, resultGenero.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = genero;
  } else {
    mostrarOk(genero);
  }

  // Datos del turno
  const especialidad = document.getElementById('especialidad');
  const medico = document.getElementById('medico');
  const consulta = document.getElementById('consulta');
  const fecha_turno = document.getElementById('fecha_turno');
  const hora_turno = document.getElementById('hora_turno');
  const modalidad = document.getElementById('modalidad');
  const plataforma = document.getElementById('plataforma');

  // Validar especialidad
  const resultEspecialidad = validaciones.especialidad(especialidad.value);
  if (!resultEspecialidad.valido) {
    mostrarError(especialidad, resultEspecialidad.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = especialidad;
  } else {
    mostrarOk(especialidad);
  }

  // Validar médico
  const resultMedico = validaciones.medico(medico.value);
  if (!resultMedico.valido) {
    mostrarError(medico, resultMedico.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = medico;
  } else {
    mostrarOk(medico);
  }

  // Validar tipo de consulta
  const resultConsulta = validaciones.consulta(consulta.value);
  if (!resultConsulta.valido) {
    mostrarError(consulta, resultConsulta.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = consulta;
  } else {
    mostrarOk(consulta);
  }

  // Validar fecha del turno
  const resultFechaTurno = validaciones.fecha_turno(fecha_turno.value);
  if (!resultFechaTurno.valido) {
    mostrarError(fecha_turno, resultFechaTurno.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = fecha_turno;
  } else {
    mostrarOk(fecha_turno);
  }

  // Validar hora del turno
  const resultHoraTurno = validaciones.hora_turno(hora_turno.value);
  if (!resultHoraTurno.valido) {
    mostrarError(hora_turno, resultHoraTurno.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = hora_turno;
  } else {
    mostrarOk(hora_turno);
  }

  // Validar modalidad
  const resultModalidad = validaciones.modalidad(modalidad.value);
  if (!resultModalidad.valido) {
    mostrarError(modalidad, resultModalidad.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = modalidad;
  } else {
    mostrarOk(modalidad);
  }

  // Validar plataforma si es videoconsulta
  const resultPlataforma = validaciones.plataforma(plataforma.value, modalidad.value);
  if (!resultPlataforma.valido) {
    mostrarError(plataforma, resultPlataforma.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = plataforma;
  } else if (modalidad.value === 'Videoconsulta' && plataforma.value) {
    mostrarOk(plataforma);
  }

  // Cobertura médica
  const cobertura = document.getElementById('cobertura');
  const credencial = document.getElementById('credencial');
  const plan = document.getElementById('plan');

  // Validar cobertura
  const resultCobertura = validaciones.cobertura(cobertura.value);
  if (!resultCobertura.valido) {
    mostrarError(cobertura, resultCobertura.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = cobertura;
  } else {
    mostrarOk(cobertura);
  }

  // Validar credencial si no es particular
  const resultCredencial = validaciones.credencial(credencial.value, cobertura.value);
  if (!resultCredencial.valido) {
    mostrarError(credencial, resultCredencial.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = credencial;
  } else if (cobertura.value !== 'Particular' && credencial.value) {
    mostrarOk(credencial);
  }

  // Validar plan si no es particular
  const resultPlan = validaciones.plan(plan.value, cobertura.value);
  if (!resultPlan.valido) {
    mostrarError(plan, resultPlan.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = plan;
  } else if (cobertura.value !== 'Particular' && plan.value) {
    mostrarOk(plan);
  }

  // Información adicional
  const primeraVisita = document.getElementById('primera-visita');
  const comoNosConocio = document.getElementById('como-nos-conocio');
  const motivo = document.getElementById('motivo');
  const estudiosPrevios = document.getElementById('estudios-previos');
  const descripcionEstudios = document.getElementById('descripcion-estudios');

  // Validar cómo nos conoció
  const resultComoNosConocio = validaciones.como_nos_conocio(comoNosConocio.value, primeraVisita.checked);
  if (!resultComoNosConocio.valido) {
    mostrarError(comoNosConocio, resultComoNosConocio.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = comoNosConocio;
  } else if (primeraVisita.checked && comoNosConocio.value) {
    mostrarOk(comoNosConocio);
  }

  // Validar motivo de consulta
  const resultMotivo = validaciones.motivo(motivo.value);
  if (!resultMotivo.valido) {
    mostrarError(motivo, resultMotivo.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = motivo;
  } else {
    mostrarOk(motivo);
  }

  // Validar descripción de estudios
  const resultDescripcionEstudios = validaciones.descripcion_estudios(descripcionEstudios.value, estudiosPrevios.checked);
  if (!resultDescripcionEstudios.valido) {
    mostrarError(descripcionEstudios, resultDescripcionEstudios.mensaje);
    formularioValido = false;
    if (!primerCampoInvalido) primerCampoInvalido = descripcionEstudios;
  } else if (estudiosPrevios.checked && descripcionEstudios.value) {
    mostrarOk(descripcionEstudios);
  }

  if (formularioValido) {
    // Generar número de turno
    const numeroTurno = 'TURN-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // Ocultar el formulario
    const formPage = document.querySelector('.form-page');
    formPage.style.display = 'none';
    
    // Crear y mostrar mensaje de confirmación
    const confirmacion = document.createElement('div');
    confirmacion.className = 'confirmacion-turno';
    confirmacion.innerHTML = `
      <div class="confirmacion-contenido">
        <h2>✓ Turno solicitado exitosamente</h2>
        <div class="confirmacion-datos">
          <p><strong>Número de turno:</strong> ${numeroTurno}</p>
          <p><strong>Paciente:</strong> ${nombre.value} ${apellido.value}</p>
          <p><strong>Especialidad:</strong> ${especialidad.value}</p>
          <p><strong>Fecha del turno:</strong> ${fecha_turno.value}</p>
          <p><strong>Hora del turno:</strong> ${hora_turno.value}</p>
        </div>
        <p class="confirmacion-mensaje">En breve recibirás una confirmación por email a <strong>${email.value}</strong></p>
        <a href="index.html" class="btn-volver">Volver a la página principal</a>
      </div>
    `;
    
    const main = document.querySelector('main');
    main.appendChild(confirmacion);
  } else {
    // Desplazarse al primer campo inválido
    if (primerCampoInvalido) {
      primerCampoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    alert('Por favor, corrija los errores del formulario');
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('turnoForm');
  form.addEventListener('submit', validarFormulario);
});

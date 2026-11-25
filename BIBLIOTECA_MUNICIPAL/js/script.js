// BIBLIOTECA MUNICIPAL - funciones normales, onclick y LocalStorage
var CLAVE_DATOS = "bibliotecaMunicipalDatos";
function obtenerDatos(){
 let texto=localStorage.getItem(CLAVE_DATOS);
 if(texto==null){let inicial={libros:[],usuarios:[],prestamos:[],categorias:["Novela","Ciencia","Historia","Tecnología","Literatura"]};localStorage.setItem(CLAVE_DATOS,JSON.stringify(inicial));return inicial;}
 return JSON.parse(texto);
}
function guardarDatos(datos){
    localStorage.setItem(CLAVE_DATOS,JSON.stringify(datos));
}
function nuevoId(){
    return String(new Date().getTime())+String(Math.floor(Math.random()*1000));
}
function iniciarSesion(){
    let u=document.getElementById('usuario').value;
    let c=document.getElementById('contrasena').value;
    let m=document.getElementById('mensajeError');
    if((u=='admin'||u=='admin@biblioteca.com')&&c=='Admin123'){
        sessionStorage.setItem('bibliotecaMunicipalSesion','activa');window.location.href='pages/inicio.html';
    }
    else{
        m.innerHTML='El usuario o la contraseña son incorrectos.';
    }
}
function comprobarSesion(){
    if(sessionStorage.getItem('bibliotecaMunicipalSesion')!='activa'){
        window.location.href='../index.html';
    }
}
function cerrarSesion(){
    sessionStorage.removeItem('bibliotecaMunicipalSesion');window.location.href='../index.html';
}
function registrarLibro(){
    let titulo=document.getElementById('tituloLibro').value;
    let autor=document.getElementById('autorLibro').value;
    let isbn=document.getElementById('isbnLibro').value;
    let editorial=document.getElementById('editorialLibro').value;
    let cantidad=Number(document.getElementById('cantidadLibro').value);
    let categoria=document.getElementById('categoriaLibro').value;
    if(titulo==''||autor==''||isbn==''||editorial==''||cantidad<=0){
        alert('Complete todos los campos. La cantidad debe ser mayor a cero.');
    }
    else{
        let d=obtenerDatos();d.libros.push(
            {id:nuevoId(),titulo:titulo,autor:autor,isbn:isbn,
                editorial:editorial,cantidad:cantidad,disponibles:cantidad,
                categoria:categoria});
            guardarDatos(d);alert('Libro registrado correctamente.');document.getElementById
            ('tituloLibro').value='';document.getElementById('autorLibro').value='';
            document.getElementById('isbnLibro').value='';
            document.getElementById('editorialLibro').value='';
            document.getElementById('cantidadLibro').value='';mostrarLibros();
        }
    }
function mostrarLibros(){
    let d=obtenerDatos();
    let t=document.getElementById('tablaLibros');
    if(t==null)return;t.innerHTML='';
    for(let i=0;i<d.libros.length;i++){
        let f=document.createElement('tr');f.innerHTML='<td>'+(i+1)+'</td><td>'+d.libros[i].titulo+
        '</td><td>'+d.libros[i].autor+'</td><td>'+d.libros[i].isbn+'</td><td>'+d.libros[i].editorial+
        '</td><td>'+d.libros[i].categoria+'</td><td>'+d.libros[i].cantidad+'</td><td>'
        +d.libros[i].disponibles+'</td><td><button class="btn danger" onclick="eliminarLibro(\''+
        d.libros[i].id+'\')">Eliminar</button></td>';t.appendChild(f);}if(d.libros.length==0)t.innerHTML
        ='<tr><td colspan="9">Todavía no hay libros registrados.</td></tr>';
    }
function eliminarLibro(id){
    let d=obtenerDatos();
    let ocupado=false;
    for(let i=0;i<d.prestamos.length;i++){
        if(d.prestamos[i].libroId==id&&d.prestamos[i].estado=='Prestado')ocupado=true;
    }if(ocupado)alert('No puede eliminar un libro con préstamo activo.');
    else if(confirm('¿Desea eliminar este libro?'))
        {let lista=[];for(let i=0;i<d.libros.length;i++)
            if(d.libros[i].id!=id)lista.push(d.libros[i]);d.libros=lista;guardarDatos(d);
            mostrarLibros();
        }
    }
function registrarUsuario(){
    let nombre=document.getElementById('nombreUsuario').value;
    let documento=document.getElementById('documentoUsuario').value;
    let correo=document.getElementById('correoUsuario').value;
    let telefono=document.getElementById('telefonoUsuario').value;
    if(nombre==''||documento==''||correo==''||telefono=='')alert('Complete todos los campos.');
    else{
        let d=obtenerDatos();d.usuarios.push({id:nuevoId(),nombre:nombre,documento:documento,
            correo:correo,telefono:telefono});guardarDatos(d);alert('Usuario registrado correctamente.');
            document.getElementById('nombreUsuario').value='';document.getElementById('documentoUsuario').value='';
            document.getElementById('correoUsuario').value='';document.getElementById('telefonoUsuario').value='';
            mostrarUsuarios();
        }
    }
function mostrarUsuarios(){
    let d=obtenerDatos();
    let t=document.getElementById('tablaUsuarios');
    if(t==null)return;
    t.innerHTML='';
    for(let i=0;i<d.usuarios.length;i++){
        let f=document.createElement('tr');
        f.innerHTML='<td>'+(i+1)+'</td><td>'+d.usuarios[i].nombre+'</td><td>'+d.usuarios[i].documento
        +'</td><td>'+d.usuarios[i].correo+'</td><td>'+d.usuarios[i].telefono
        +'</td><td><button class="btn danger" onclick="eliminarUsuario(\''+d.usuarios[i].id
        +'\')">Eliminar</button></td>';
        t.appendChild(f);}
        if(d.usuarios.length==0)t.innerHTML='<tr><td colspan="6">Todavía no hay usuarios registrados.</td></tr>';
    }
function eliminarUsuario(id){
    let d=obtenerDatos();
    let activo=false;
    for(let i=0;i<d.prestamos.length;i++)if(d.prestamos[i].usuarioId==id&&d.prestamos[i].estado=='Prestado')activo=true;
    if(activo)alert('Este usuario tiene préstamos pendientes.');
    else if(confirm('¿Desea eliminar este usuario?')){let lista=[];
        for(let i=0;i<d.usuarios.length;i++)if(d.usuarios[i].id!=id)lista.push(d.usuarios[i]);
        d.usuarios=lista;guardarDatos(d);mostrarUsuarios();
    }
}
function cargarOpcionesPrestamo(){
    let d=obtenerDatos();
    let sl=document.getElementById('libroPrestamo');
    let su=document.getElementById('usuarioPrestamo');
    if(sl==null||su==null)return;
    sl.innerHTML='<option value="">Seleccione un libro</option>';
    su.innerHTML='<option value="">Seleccione un usuario</option>';
    for(let i=0;i<d.libros.length;i++)if(d.libros[i].disponibles>0){
        let o=document.createElement('option');o.value=d.libros[i].id;o.text=d.libros[i].titulo
        +' ('+d.libros[i].disponibles+' disponibles)';sl.appendChild(o);}for(let i=0;
            i<d.usuarios.length;i++){let o=document.createElement('option');
                o.value=d.usuarios[i].id;o.text=d.usuarios[i].nombre;su.appendChild(o);
            }
        }
function registrarPrestamo(){
    let li=document.getElementById('libroPrestamo').value;
    let ui=document.getElementById('usuarioPrestamo').value;
    let fp=document.getElementById('fechaPrestamo').value;
    let fl=document.getElementById('fechaLimite').value;
    let d=obtenerDatos();
    let libro=null;
    let usuario=null;
    for(let i=0;i<d.libros.length;i++)if(d.libros[i].id==li)libro=d.libros[i];
    for(let i=0;i<d.usuarios.length;i++)if(d.usuarios[i].id==ui)usuario=d.usuarios[i];
    if(libro==null||usuario==null||fp==''||fl=='')alert('Seleccione libro, usuario y fechas.');
    else if(libro.disponibles<1)alert('No hay ejemplares disponibles.');
    else{libro.disponibles--;d.prestamos.push({id:nuevoId(),libroId:libro.id,tituloLibro:libro.titulo,
        usuarioId:usuario.id,nombreUsuario:usuario.nombre,fechaPrestamo:fp,fechaLimite:fl,
        estado:'Prestado'});guardarDatos(d);
        alert('Préstamo registrado.');
        mostrarPrestamos();cargarOpcionesPrestamo();}}
function mostrarPrestamos(){
    let d=obtenerDatos();
    let t=document.getElementById('tablaPrestamos');
    if(t==null)return;t.innerHTML='';
    for(let i=0;i<d.prestamos.length;i++){let p=d.prestamos[i];
        let f=document.createElement('tr');f.innerHTML='<td>'+(i+1)+'</td><td>'+p.nombreUsuario
        +'</td><td>'+p.tituloLibro+'</td><td>'+p.fechaPrestamo+'</td><td>'+p.fechaLimite+'</td><td>'+
        p.estado+'</td>';t.appendChild(f);
    }if(d.prestamos.length==0)t.innerHTML='<tr><td colspan="6">Todavía no hay préstamos.</td></tr>';}
function mostrarDevoluciones(){
    let d=obtenerDatos();
    let t=document.getElementById('tablaDevoluciones');
    if(t==null)return;t.innerHTML='';let n=0;for(let i=0;i<d.prestamos.length;i++){let p=d.prestamos[i];
        if(p.estado=='Prestado'){n++;let f=document.createElement('tr');
            f.innerHTML='<td>'+n+'</td><td>'+p.nombreUsuario+'</td><td>'+p.tituloLibro+'</td><td>'+
            p.fechaPrestamo+'</td><td>'+p.fechaLimite+'</td><td>'+p.estado
            +'</td><td><button class="btn primary" onclick="devolverLibro(\''+p.id
            +'\')">Registrar devolución</button></td>';t.appendChild(f);
        }}if(n==0)t.innerHTML='<tr><td colspan="7">No hay préstamos pendientes.</td></tr>';}
function devolverLibro(id){
    let d=obtenerDatos();
    for(let i=0;i<d.prestamos.length;i++)if(d.prestamos[i].id==id&&d.prestamos[i].estado=='Prestado')
        {d.prestamos[i].estado='Devuelto';for(let j=0;j<d.libros.length;j++)
            if(d.libros[j].id==d.prestamos[i].libroId)d.libros[j].disponibles++;
        }guardarDatos(d);mostrarDevoluciones();}
function agregarCategoria(){
    let nombre=document.getElementById('nombreCategoria').value;
    let d=obtenerDatos();if(nombre=='')alert('Escriba una categoría.');
    else{let existe=false;
        for(let i=0;i<d.categorias.length;i++)
            if(d.categorias[i].toLowerCase()==nombre.toLowerCase())existe=true;
        if(existe)alert('La categoría ya existe.');
        else{d.categorias.push(nombre);guardarDatos(d);document.getElementById('nombreCategoria').value
            ='';mostrarCategorias();}}}
function mostrarCategorias(){
    let d=obtenerDatos();
    let l=document.getElementById('listaCategorias');
    if(l==null)return;l.innerHTML='';
    for(let i=0;i<d.categorias.length;i++){let e=document.createElement('li');e.innerHTML=d.categorias[i];
        l.appendChild(e);}}
function mostrarInicio(){
    let d = obtenerDatos();
    document.getElementById('totalLibros').innerHTML = d.libros.length;
    document.getElementById('totalUsuarios').innerHTML = d.usuarios.length;
    let activos = 0;
    let devueltos = 0;

    for (let i = 0; i < d.prestamos.length; i++) {
        if (d.prestamos[i].estado == 'Prestado') {
            activos++;
        } else if (d.prestamos[i].estado == 'Devuelto') {
            devueltos++;
        }
    }

    document.getElementById('totalPrestamos').innerHTML = activos;
    document.getElementById('totalDevoluciones').innerHTML = devueltos;
    mostrarPrestamosRecientes();
}

function mostrarPrestamosRecientes() {
    let d = obtenerDatos();
    let tabla = document.getElementById('tablaPrestamosRecientes');
    if (tabla == null) return;

    tabla.innerHTML = '';
    let cantidad = 0;

    for (let i = d.prestamos.length - 1; i >= 0 && cantidad < 5; i--) {
        let prestamo = d.prestamos[i];
        let fila = document.createElement('tr');
        fila.innerHTML = '<td>' + prestamo.nombreUsuario + '</td>' +
            '<td>' + prestamo.tituloLibro + '</td>' +
            '<td>' + prestamo.fechaPrestamo + '</td>' +
            '<td><span class="badge">' + prestamo.estado + '</span></td>';
        tabla.appendChild(fila);
        cantidad++;
    }

    if (cantidad == 0) {
        tabla.innerHTML = '<tr><td colspan="4" class="empty">Todavía no hay préstamos registrados.</td></tr>';
    }
}
function mostrarReporte(){
    let d=obtenerDatos();
    let total=0;
    let t=document.getElementById('tablaReporte');
    for(let i=0;i<d.libros.length;i++){total+=Number(d.libros[i].cantidad);
        let f=document.createElement('tr');f.innerHTML='<td>'+d.libros[i].titulo+'</td><td>'+
        d.libros[i].autor+'</td><td>'+d.libros[i].categoria+'</td><td>'+d.libros[i].cantidad
        +'</td><td>'+d.libros[i].disponibles+'</td>';t.appendChild(f);
    }
    document.getElementById('reporteEjemplares').innerHTML=total;
    document.getElementById('reporteUsuarios').innerHTML=d.usuarios.length;
    let n=0;
    for(let i=0;i<d.prestamos.length;i++)if(d.prestamos[i].estado=='Prestado')n++;
    document.getElementById('reporteActivos').innerHTML=n;
}
function borrarDatos(){
    if(confirm('¿Está seguro de borrar todos los registros?')){localStorage.removeItem(CLAVE_DATOS);
        alert('Se borraron los registros.');location.reload();}}
function iniciarPagina(){
    comprobarSesion();
    let p=document.body.getAttribute('data-page');
    if(p=='libros')mostrarLibros();
    if(p=='usuarios')mostrarUsuarios();
    if(p=='prestamos'){cargarOpcionesPrestamo();mostrarPrestamos();
    }
    if(p=='devoluciones')mostrarDevoluciones();
    if(p=='categorias')mostrarCategorias();
    if(p=='inicio')mostrarInicio();if(p=='reportes')mostrarReporte();
    let b=document.getElementById('cerrarSesion');
    if(b!=null)b.onclick=cerrarSesion;}
window.onload=function(){
    if(document.body.getAttribute('data-page')!=null)iniciarPagina();};

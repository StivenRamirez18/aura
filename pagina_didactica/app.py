from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'clave_secreta_para_niños_programadores'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de usuario
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    contraseña = db.Column(db.String(200), nullable=False)

# Crear la base de datos si no existe
with app.app_context():
    db.create_all()

# Decorador para rutas que requieren login
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'usuario_id' not in session:
            flash('Por favor inicia sesión para acceder a esta página', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Rutas
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nombre = request.form['nombre']
        usuario = request.form['usuario']
        contraseña = request.form['contraseña']
        
        # Verificar si el usuario ya existe
        usuario_existente = Usuario.query.filter_by(usuario=usuario).first()
        if usuario_existente:
            flash('Este nombre de usuario ya está en uso. Por favor elige otro.', 'error')
            return redirect(url_for('register'))
        
        # Crear nuevo usuario
        hash_contraseña = generate_password_hash(contraseña)
        nuevo_usuario = Usuario(nombre=nombre, usuario=usuario, contraseña=hash_contraseña)
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        flash('¡Te has registrado correctamente! Ahora puedes iniciar sesión.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        contraseña = request.form['contraseña']
        
        # Buscar usuario
        usuario_encontrado = Usuario.query.filter_by(usuario=usuario).first()
        
        # Verificar usuario y contraseña
        if usuario_encontrado and check_password_hash(usuario_encontrado.contraseña, contraseña):
            session['usuario_id'] = usuario_encontrado.id
            session['nombre_usuario'] = usuario_encontrado.nombre
            flash(f'¡Bienvenido de nuevo, {usuario_encontrado.nombre}!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Usuario o contraseña incorrectos. Intenta de nuevo.', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('usuario_id', None)
    session.pop('nombre_usuario', None)
    flash('Has cerrado sesión correctamente.', 'success')
    return redirect(url_for('index'))

# Rutas para los temas
@app.route('/teoria_color')
@login_required
def teoria_color():
    return render_template('teoria_color.html')

@app.route('/gestalt')
@login_required
def gestalt():
    return render_template('gestalt.html')

@app.route('/nielsen')
@login_required
def nielsen():
    return render_template('nielsen.html')

@app.route('/recoleccion')
@login_required
def recoleccion():
    return render_template('recoleccion.html')

@app.route('/wireframes')
@login_required
def wireframes():
    return render_template('wireframes.html')

if __name__ == '__main__':
    app.run(debug=True)

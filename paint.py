import turtle

# Configuración inicial
window = turtle.Screen()
window.title("Programa de dibujo simple")
window.bgcolor("white")

pen = turtle.Turtle()
pen.speed(3)  # Velocidad de dibujo (1-10)

# Funciones para mover el lápiz
def move_forward():
    pen.forward(100)

def move_backward():
    pen.backward(100)

def turn_left():
    pen.left(90)

def turn_right():
    pen.right(90)

def exit_program():
    window.bye()

# Configurar los controles del teclado
window.onkey(move_forward, "Up")
window.onkey(move_backward, "Down")
window.onkey(turn_left, "Left")
window.onkey(turn_right, "Right")
window.onkey(exit_program, "Escape")

# Habilitar la escucha de eventos del teclado
window.listen()

# Mantener la ventana abierta hasta que se cierre
turtle.done()

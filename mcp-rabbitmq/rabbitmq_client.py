import pika
import json

def publish_message(queue_name: str, message: str, connection: dict):
    """
    Publica un mensaje en RabbitMQ usando los parámetros de conexión proporcionados.
    """

    credentials = pika.PlainCredentials(
        connection["username"],
        connection["password"]
    )

    parameters = pika.ConnectionParameters(
        host=connection["host"],
        port=connection["port"],
        credentials=credentials
    )

    # Establecer conexión
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    # Asegurar que la cola existe
    channel.queue_declare(queue=queue_name, durable=True)

    # Publicar mensaje (lo convertimos a JSON por profesionalidad)
    body = json.dumps(message)

    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=body
    )

    connection.close()

    return {
        "status": "ok",
        "queue": queue_name,
        "message": message
    }

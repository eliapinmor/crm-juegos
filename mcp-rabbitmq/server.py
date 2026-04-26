from mcp.server.fastmcp import FastMCP
from rabbitmq_client import publish_message

mcp = FastMCP()

@mcp.tool()
def publish_to_rabbitmq(queue_name: str, message: dict):
    """
    Publica un mensaje en RabbitMQ usando la configuración por defecto.
    """

    connection = {
        "host": "localhost",
        "port": 5672,
        "username": "guest",
        "password": "guest"
    }

    result = publish_message(queue_name, message, connection)
    return result

if __name__ == "__main__":
    mcp.run()

import logging

logger = logging.getLogger("catalog_manager")
logger.setLevel(logging.INFO)

# Stream handler
stream_handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

# File handler
file_handler = logging.FileHandler("chat.log")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

import pytest
from unittest.mock import MagicMock, patch
import os
import json

from backend.services.groq_service import GroqService

# Mock the os.environ.get for GROQ_API_KEY
@pytest.fixture(autouse=True)
def mock_groq_api_key():
    with patch.dict(os.environ, {"GROQ_API_KEY": "test_key"}):
        yield

@pytest.fixture
def groq_service():
    return GroqService()

@pytest.fixture
def mock_groq_client():
    with patch("backend.services.groq_service.Groq") as mock_groq:
        yield mock_groq.return_value

class MockCompletion:
    def __init__(self, content):
        self.choices = [MagicMock(message=MagicMock(content=content))]


def test_generate_product_insights_success(groq_service, mock_groq_client):
    expected_insights = {
        "product_overview": "Test overview",
        "key_benefits": ["benefit1", "benefit2"],
        "target_audience": "Test audience",
        "unique_selling_points": ["usp1", "usp2"],
        "competitor_insights": [],
        "keyword_suggestions": ["keyword1", "keyword2"],
        "keyword_optimization_score": 80,
        "seo_friendliness_score": 75,
        "overall_optimization_score": 78,
    }
    mock_groq_client.chat.completions.create.return_value = MockCompletion(json.dumps(expected_insights))

    description = "A test product description"
    insights = groq_service.generate_product_insights(description)

    assert insights == expected_insights
    mock_groq_client.chat.completions.create.assert_called_once()

def test_generate_product_insights_invalid_json(groq_service, mock_groq_client):
    invalid_json_response = "This is not valid JSON"
    mock_groq_client.chat.completions.create.return_value = MockCompletion(invalid_json_response)

    description = "Another test description"
    insights = groq_service.generate_product_insights(description)

    assert "error" in insights
    assert insights["error"] == "Groq did not return valid JSON."
    assert insights["raw_groq_output"] == invalid_json_response

def test_compare_product_descriptions_success(groq_service, mock_groq_client):
    expected_comparison = {
        "comparison": {
            "seo_keyword_richness": {"original": 50, "optimized": 80, "insight": "Improved keywords"},
            "clarity_readability": {"original": 60, "optimized": 90, "insight": "Much clearer"},
            "persuasiveness": {"original": 55, "optimized": 85, "insight": "More compelling"},
            "uniqueness": {"original": 40, "optimized": 70, "insight": "More unique"},
            "best_practices": {"original": 65, "optimized": 95, "insight": "Follows best practices"},
        },
        "overall_score": {"original": 58, "optimized": 85, "insight": "Significant improvement"},
        "conclusion": "Optimized product is much better.",
    }
    mock_groq_client.chat.completions.create.return_value = MockCompletion(json.dumps(expected_comparison))

    original_desc = "Original description"
    optimized_desc = "Optimized description"
    comparison = groq_service.compare_product_descriptions(original_desc, optimized_desc)

    assert comparison == expected_comparison
    mock_groq_client.chat.completions.create.assert_called_once()

def test_compare_product_descriptions_invalid_json(groq_service, mock_groq_client):
    invalid_json_response = "Not JSON at all"
    mock_groq_client.chat.completions.create.return_value = MockCompletion(invalid_json_response)

    original_desc = "Original description"
    optimized_desc = "Optimized description"
    comparison = groq_service.compare_product_descriptions(original_desc, optimized_desc)

    assert "error" in comparison
    assert comparison["error"] == "Groq did not return valid JSON."
    assert comparison["raw_groq_output"] == invalid_json_response



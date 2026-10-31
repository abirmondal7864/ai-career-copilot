from unittest.mock import Mock, patch

import pytest

from app.services.pdf_parser import extract_text_from_pdf


@patch("app.services.pdf_parser.pymupdf.open")
def test_extract_text_from_pdf_success(mock_open):
    page1 = Mock()
    page1.get_text.return_value = "Hello Abir"

    page2 = Mock()
    page2.get_text.return_value = "AI Career Copilot"

    document = Mock()
    document.__iter__ = Mock(return_value=iter([page1, page2]))

    mock_open.return_value = document

    result = extract_text_from_pdf("sample.pdf")

    assert result == "Hello Abir\nAI Career Copilot"
    mock_open.assert_called_once_with("sample.pdf")
    page1.get_text.assert_called_once_with("text")
    page2.get_text.assert_called_once_with("text")
    document.close.assert_called_once()


@patch("app.services.pdf_parser.pymupdf.open")
def test_extract_text_from_empty_pdf(mock_open):
    document = Mock()
    document.__iter__ = Mock(return_value=iter([]))

    mock_open.return_value = document

    result = extract_text_from_pdf("empty.pdf")

    assert result == ""
    document.close.assert_called_once()


@patch("app.services.pdf_parser.pymupdf.open")
def test_extract_text_ignores_non_string_values(mock_open):
    page1 = Mock()
    page1.get_text.return_value = None

    page2 = Mock()
    page2.get_text.return_value = "Valid text"

    document = Mock()
    document.__iter__ = Mock(return_value=iter([page1, page2]))

    mock_open.return_value = document

    result = extract_text_from_pdf("sample.pdf")

    assert result == "Valid text"
    document.close.assert_called_once()


@patch("app.services.pdf_parser.pymupdf.open")
def test_extract_text_invalid_pdf(mock_open):
    mock_open.side_effect = Exception("Invalid PDF")

    with pytest.raises(Exception, match="Invalid PDF"):
        extract_text_from_pdf("invalid.pdf")
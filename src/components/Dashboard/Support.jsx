import { useAuth } from "hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactComponent as Person } from "../../assets/img/user-circle.svg";
import { ReactComponent as SendButton } from "../../assets/img/send-button.svg";
import { Loader } from "components/Loader";
import { FaSpinner } from "react-icons/fa";
import i18next, { t } from "i18next";

export const Support = () => {
  const { bearerToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending , setIsSending] = useState(false);

  const handelSendClick = (e) => {
    e.preventDefault();
    if (!message) {
      setMessageError(true);
      return;
    }
    setIsSending(true);
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${bearerToken}`,
    };
    const body = {
      message: message,
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
    const url = `${process.env.REACT_APP_BASE_URL}/send-message`;
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response;
      })
      .then(() => {
        const newMessage = {
          message: message,
          is_sender: true,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        setIsSending(false);
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setIsSending(false);
          alert(t('Message was not sent'));
        }, 2000);
      });
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const fetchContent = useCallback(() => {
    const url = `${process.env.REACT_APP_BASE_URL}/fetch-messages`;
    const headers = {
      authorization: `Bearer ${bearerToken}`,
    };
    const options = {
      headers: headers,
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log(data);
          const fetchedMessages = data.data.messages;
          setMessages(fetchedMessages);
        } else {
          throw data.message;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bearerToken]);

  useEffect(() => {
    setIsLoading(true);
    fetchContent();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [fetchContent]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 2002);
  }, [messages]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`support ${i18next.language === 'ar' ? 'ar' : ''}`}>
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.map((message, key) => (
              <div
                className={`message ${message.is_sender ? "sender" : ""}`}
                key={key} 
              >
                {(key === 0 ||
                  message.is_sender !== messages[key - 1].is_sender) && (
                  <Person className="person"/>
                )}
                {message.message}
              </div>
            ))}
          </div>
          <div className={`input-container ${messageError ? "error" : ""}`}>
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setMessageError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handelSendClick(e);
                }
              }}
            />
            <a
              href="/send"
              className="send-button"
              onClick={(e) => {
                handelSendClick(e);
              }}
            >
              
              {isSending ? <FaSpinner className="spinner" /> : <SendButton />}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

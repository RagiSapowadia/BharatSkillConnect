import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Users, Clock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "@/hooks/use-toast";

const MessagingComponent = ({ courseId, courseTitle }) => {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (courseId) {
      fetchMessages();
    }
    fetchConversations();
  }, [courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`/messages/course/${courseId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get("/messages/conversations");
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/messages/send", {
        receiverId: selectedConversation.receiverId,
        courseId: courseId,
        message: newMessage.trim(),
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        await fetchConversations(); // Refresh conversations
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationTitle = (conversation) => {
    if (conversation.course) {
      return conversation.course.title;
    }
    return "Course Discussion";
  };

  const getUnreadCount = (conversation) => {
    return conversation.unreadCount || 0;
  };

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Conversations</h3>
        </div>
        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.course._id}
                className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                  selectedConversation?.course?._id === conversation.course._id
                    ? "bg-blue-100 border-blue-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setMessages(conversation.messages || []);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {getConversationTitle(conversation)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {conversation.messages?.length || 0} messages
                    </p>
                  </div>
                  {getUnreadCount(conversation) > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {getUnreadCount(conversation)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  {getConversationTitle(selectedConversation)}
                </h3>
              </div>
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.senderId._id === auth.user._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId._id === auth.user._id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-75">
                          {message.senderId.name}
                        </span>
                        <span className="text-xs opacity-75 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || loading}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingComponent;

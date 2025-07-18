
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { X, Send, Bot, User, MessageCircle, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThreeDotsLoading } from "./ui/three-dots-loading";

const botKnowledge = {
  about: {
    keywords: ["about", "company", "who are you", "background", "history", "servexlb"],
    response: "ServexLB is a premier digital services provider based in Beirut, Lebanon. Founded by Salim Hage, we specialize in providing digital load balancing, content distribution, and subscription management services to businesses of all sizes."
  },
  services: {
    keywords: ["services", "products", "offerings", "what do you offer", "what do you sell", "provide"],
    response: "We offer a range of digital services including load balancing, content distribution, managed subscriptions, wholesale distribution, and customized digital solutions for businesses. You can check our Services page for detailed information about each offering."
  },
  pricing: {
    keywords: ["price", "cost", "pricing", "how much", "package", "plan", "subscription cost"],
    response: "Our pricing varies depending on the specific service and your business needs. We offer flexible plans starting from affordable rates for small businesses to enterprise-level solutions. You can check detailed pricing on our Services page, or I can connect you with a team member for a personalized quote."
  },
  contact: {
    keywords: ["contact", "reach", "phone", "email", "address", "location", "office"],
    response: "You can contact us through email at support@servexlb.com, call us at +961 78 991 908, or visit our office located at Beirut Downtown, Martyr's Square, Beirut, Lebanon. Our team is available Monday-Friday, 9AM-6PM EST."
  },
  team: {
    keywords: ["team", "staff", "employees", "experts", "specialists", "who works"],
    response: "ServexLB is led by our founder and CEO Salim Hage, along with a dedicated team of professionals including technical experts, customer support specialists, and industry consultants. Each team member brings valuable expertise to help our clients succeed."
  },
  subscription: {
    keywords: ["subscription", "account", "login", "sign in", "dashboard", "profile"],
    response: "You can manage your subscriptions through your Dashboard after logging in. If you're having issues with your subscription or need assistance, our support team is ready to help."
  },
  support: {
    keywords: ["help", "support", "assistance", "issue", "problem", "trouble", "question"],
    response: "We're here to help! For technical support, you can submit a support ticket through your Dashboard, or contact our support team directly at support@servexlb.com. Our response time is typically within 24 hours."
  },
  refund: {
    keywords: ["refund", "cancel", "money back", "return", "cancellation"],
    response: "We offer refunds within 24 hours of purchase if the service doesn't work as described. For cancellations, please visit your Dashboard. If you need more detailed information about our refund policy, please contact our support team."
  },
  security: {
    keywords: ["security", "privacy", "data", "protection", "secure", "safe"],
    response: "ServexLB takes security and privacy very seriously. We employ industry-standard encryption and security measures to protect your data. For specific questions about our security practices, please contact our technical team."
  },
  wholesale: {
    keywords: ["wholesale", "bulk", "distributor", "reseller", "partner"],
    response: "We offer wholesale solutions for distributors and resellers. Our wholesale platform provides special pricing, bulk ordering capabilities, and dedicated support. If you're interested in becoming a wholesale partner, please contact our sales team."
  },
  faq: {
    keywords: ["faq", "frequently asked", "common questions", "questions"],
    response: "You can find answers to frequently asked questions on our FAQ page. If you don't find what you're looking for, feel free to ask me directly or contact our support team for more assistance."
  },
  payment: {
    keywords: ["payment", "pay", "method", "credit card", "paypal", "checkout"],
    response: "We accept various payment methods including credit cards, PayPal, and bank transfers. All payments are processed securely. If you have any questions about payment options, please reach out to our support team."
  },
  delivery: {
    keywords: ["delivery", "receive", "access", "instant", "download", "get my product"],
    response: "Our digital services are delivered instantly after payment confirmation. You'll receive access credentials via email and can also find them in your account dashboard. If you encounter any delivery issues, please contact our support immediately."
  },
  technical: {
    keywords: ["technical", "specs", "specifications", "requirements", "system", "compatible"],
    response: "Our services are compatible with most modern web browsers and operating systems. For specific technical requirements or compatibility questions, please check the service details page or contact our technical support team."
  },
  streaming: {
    keywords: ["streaming", "netflix", "spotify", "disney", "stream", "watch", "music"],
    response: "We offer premium streaming service accounts at competitive rates. Our streaming services include popular platforms like Netflix, Spotify, Disney+, and more. All accounts come with full warranty and instant delivery."
  },
  gaming: {
    keywords: ["gaming", "game", "playstation", "xbox", "steam", "nintendo"],
    response: "Our gaming services include game keys, subscription services for PlayStation, Xbox, and other platforms. We provide competitive prices and instant delivery for all gaming products."
  },
  social: {
    keywords: ["social", "instagram", "facebook", "twitter", "tiktok", "followers", "likes"],
    response: "We provide various social media services including account management, follower growth, and content promotion. Our solutions help businesses and individuals build their online presence effectively."
  },
  api: {
    keywords: ["api", "integration", "developer", "code", "program", "development"],
    response: "We offer API access to our services for developers who want to integrate our solutions into their applications. Our developer documentation provides all the information needed to get started with our APIs."
  },
  mobile: {
    keywords: ["mobile", "phone", "app", "android", "ios", "smartphone"],
    response: "Our services are fully compatible with mobile devices. You can access your account and manage your subscriptions from any smartphone or tablet. We also offer dedicated mobile apps for some services."
  },
  comparison: {
    keywords: ["compare", "versus", "vs", "difference", "better", "competitors"],
    response: "What sets ServexLB apart from competitors is our commitment to quality, customer service, and competitive pricing. We offer 24/7 support, instant delivery, and a satisfaction guarantee on all our services."
  }
};

const faqList = [
  { question: "What services do you offer?", answer: botKnowledge.services.response },
  { question: "How much do your services cost?", answer: botKnowledge.pricing.response },
  { question: "How do I contact customer support?", answer: botKnowledge.support.response },
  { question: "What is your refund policy?", answer: botKnowledge.refund.response },
  { question: "How do I access my account?", answer: botKnowledge.subscription.response },
  { question: "Is my data secure with your services?", answer: botKnowledge.security.response },
  { question: "What streaming services do you provide?", answer: botKnowledge.streaming.response },
  { question: "What gaming services do you offer?", answer: botKnowledge.gaming.response },
  { question: "How can I become a wholesale partner?", answer: botKnowledge.wholesale.response },
  { question: "I need help with my subscription", answer: "We're here to help with your subscription issues. Common problems include expired payment methods, service interruptions, or access issues. You can update your payment information in your account dashboard, or contact our support team at support@servexlb.com for immediate assistance." },
  { question: "How do I upgrade my plan?", answer: "Upgrading your plan is easy! Simply log into your account dashboard, navigate to 'Subscriptions', select the service you want to upgrade, and click on 'Upgrade Plan'. You'll see all available options with price differences. Changes take effect immediately after payment confirmation." },
  { question: "I can't access my streaming account", answer: "If you're having trouble accessing your streaming account, please try these steps: 1) Verify your login credentials are correct, 2) Check if your subscription is active in your dashboard, 3) Try logging out and back in, 4) Clear your browser cache. If problems persist, contact support with your account details and we'll resolve it within 24 hours." },
  { question: "How does the wholesale program work?", answer: "Our wholesale program allows distributors and resellers to purchase our digital services at discounted rates. You'll get access to our wholesale portal with bulk pricing, dedicated support, and simplified ordering. To join, you'll need to complete an application process including business verification. Contact our wholesale team at wholesale@servexlb.com to get started." },
  { question: "Do you offer educational discounts?", answer: "Yes! We offer special pricing for educational institutions, teachers, and students. Our educational packages include discounts of up to 40% on regular pricing. To qualify, you'll need to verify your educational status. Contact our education team at education@servexlb.com with your institution details." },
  { question: "I need a custom solution for my business", answer: "We specialize in creating custom digital solutions tailored to your business needs. Our team can work with you to develop specialized load balancing configurations, content distribution networks, or subscription management systems. Contact our business solutions team at business@servexlb.com to schedule a consultation." },
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFaq, setShowFaq] = useState(true);
  const [liveSupportRequested, setLiveSupportRequested] = useState(false);
  const [adminJoined, setAdminJoined] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionIdRef = useRef(Date.now().toString());

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
        id: Date.now().toString(),
        text: "Hi there! I'm ServexLB's virtual assistant. How can I help you today? You can ask about our services, pricing, or select from common questions below.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isTyping) {
      inputRef.current?.focus();
    }
  }, [isOpen, isTyping, messages]);

  // Check localStorage for admin join status
  useEffect(() => {
    if (liveSupportRequested) {
      const checkAdminJoined = setInterval(() => {
        const chatSessions = JSON.parse(localStorage.getItem("adminChatSessions") || "[]");
        const currentSession = chatSessions.find(
          (session ) => session.id === sessionIdRef.current
        );
        
        if (currentSession?.agentJoined) {
          setAdminJoined(true);
          
          const adminMessage = {
            id: Date.now().toString(),
            text: "Hi, this is a support agent from ServexLB. I'm here to help you with your inquiry. How can I assist you today?",
            sender: "admin",
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, adminMessage]);
          
          toast.success("Support agent has joined the chat!", {
            description: "A live agent is now available to assist you.",
          });
          
          clearInterval(checkAdminJoined);
        }
      }, 2000);
      
      return () => clearInterval(checkAdminJoined);
    }
  }, [liveSupportRequested]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    setIsTyping(true);
    setShowFaq(false);

    // Save to localStorage for regular chat history
    const chatHistory = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    localStorage.setItem("chatMessages", JSON.stringify([...chatHistory, userMessage]));

    // If in live support mode, also add to admin chat sessions
    if (liveSupportRequested) {
      const adminChatSessions = JSON.parse(localStorage.getItem("adminChatSessions") || "[]");
      const sessionIndex = adminChatSessions.findIndex(
        (session) => session.id === sessionIdRef.current
      );
      
      if (sessionIndex >= 0) {
        adminChatSessions[sessionIndex].messages.push(userMessage);
        localStorage.setItem("adminChatSessions", JSON.stringify(adminChatSessions));
      }
      
      setIsTyping(false);
      inputRef.current?.focus();
      return;
    }

    setTimeout(() => {
      // Only generate bot response if not in live support mode
      if (!liveSupportRequested) {
        const botResponse = generateBotResponse(input);
        const botMessage = {
          id: Date.now().toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setShowFaq(true);
        
        const updatedChatHistory = JSON.parse(localStorage.getItem("chatMessages") || "[]");
        localStorage.setItem("chatMessages", JSON.stringify([...updatedChatHistory, botMessage]));
      }
      
      setIsTyping(false);
      inputRef.current?.focus();
    }, 800);
  };

  const handleFaqSelect = (question, answer) => {
    const userMessage = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowFaq(false);
    setIsTyping(true);
    
    const chatHistory = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    localStorage.setItem("chatMessages", JSON.stringify([...chatHistory, userMessage]));

    setTimeout(() => {
      const botMessage = {
        id: Date.now().toString(),
        text: answer,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setShowFaq(true);
      
      const updatedChatHistory = JSON.parse(localStorage.getItem("chatMessages") || "[]");
      localStorage.setItem("chatMessages", JSON.stringify([...updatedChatHistory, botMessage]));
      
      inputRef.current?.focus();
    }, 800);
  };

  const handleLiveSupport = () => {
    const userMessage = {
      id: Date.now().toString(),
      text: "I would like to speak with a live support agent.",
      sender: "user",
      timestamp: new Date()
    };

    const botMessage = {
      id: Date.now().toString(),
      text: "Connecting you with a live support agent. Please wait a moment while we transfer you to the next available representative.",
      sender: "bot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowFaq(false);
    setLiveSupportRequested(true);
    
    // Create a new chat session in localStorage for admin to pick up
    const newSession = {
      id: sessionIdRef.current,
      userId: `user-${Math.floor(Math.random() * 1000)}`,
      active: true,
      agentJoined: false,
      timestamp: new Date(),
      messages: [...messages, userMessage, botMessage]
    };
    
    const existingSessions = JSON.parse(localStorage.getItem("adminChatSessions") || "[]");
    localStorage.setItem("adminChatSessions", JSON.stringify([...existingSessions, newSession]));
    
    toast.success("Live support request sent!", {
      description: "Our team will be with you shortly.",
    });
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    const isQuestion = input.includes("?") || 
                      input.startsWith("what") || 
                      input.startsWith("how") || 
                      input.startsWith("why") || 
                      input.startsWith("when") || 
                      input.startsWith("where") || 
                      input.startsWith("who") || 
                      input.startsWith("can") || 
                      input.startsWith("do");
    
    const isGreeting = input.includes("hello") || 
                      input.includes("hi") || 
                      input.includes("hey") || 
                      input.includes("greetings") || 
                      input.includes("good morning") || 
                      input.includes("good afternoon") || 
                      input.includes("good evening");
    
    const isThanking = input.includes("thank") || 
                      input.includes("thanks") || 
                      input.includes("appreciate") || 
                      input.includes("grateful");
    
    const isComplaining = input.includes("not working") || 
                          input.includes("issue") || 
                          input.includes("problem") || 
                          input.includes("broken") || 
                          input.includes("error") || 
                          input.includes("doesn't work") || 
                          input.includes("failed");
    
    if (isGreeting) {
      return "Hello! It's great to chat with you. How can I assist you with our services today?";
    }
    
    if (isThanking) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    if (isComplaining) {
      return "I'm sorry to hear you're experiencing issues. To help resolve this quickly, please provide more details about the problem, or I can connect you with our support team immediately.";
    }
    
    for (const category in botKnowledge) {
      const topicData = botKnowledge[category[ botKnowledge]];
      
      if (topicData.keywords.some(keyword => input.includes(keyword))) {
        return topicData.response;
      }
    }
    
    if (input.includes("speak") || input.includes("human") || input.includes("agent") || 
        input.includes("person") || input.includes("team") || input.includes("real person")) {
      return "I'll connect you with a team member right away. Would you like to leave any additional information about your query to help them assist you better?";
    }
    
    if (input.includes("website") || input.includes("site") || input.includes("page") || input.includes("navigation")) {
      return "Our website offers easy navigation to explore our services, learn about our company, contact our team, and access your dashboard. Is there a specific feature or section you're looking for? I'd be happy to guide you.";
    }
    
    if (input.includes("load balancing") || input.includes("cdn") || input.includes("content distribution") || 
        input.includes("how does") || input.includes("technical") || input.includes("technology")) {
      return "Our technical solutions employ cutting-edge technologies to deliver reliable services. For more detailed information about our technical infrastructure, I recommend checking our Services page or I can connect you with one of our specialists who can provide in-depth explanations.";
    }
    
    if (isQuestion) {
      return "That's a great question. While I don't have the specific answer right now, I can help connect you with someone from our team who can provide you with accurate information. Would you like me to do that for you?";
    }
    
    return "Thank you for your message. I'm here to help with any questions about our services, pricing, or support options. Could you provide a bit more detail about what you're looking for so I can better assist you?";
  };

  const ChatContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex justify-between items-center bg-black">
        <h3 className="font-medium">ServexLB Support</h3>
        <Button 
          size="icon" 
          onClick={() => setIsOpen(false)} 
          className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 bg-black space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.sender === "admin" 
                  ? "bg-green-700 text-white"
                  : "bg-muted"
              }`}
            >
              <div className="flex items-center mb-1">
                {message.sender === "bot" ? (
                  <Bot className="h-3 w-3 mr-1" />
                ) : message.sender === "admin" ? (
                  <Shield className="h-3 w-3 mr-1" />
                ) : (
                  <User className="h-3 w-3 mr-1" />
                )}
                <span className="text-xs opacity-70">
                  {message.sender === "user" ? "You" : message.sender === "admin" ? "Support Agent" : "Bot"}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted px-3 py-2 rounded-lg">
              <div className="flex items-center">
                <Bot className="h-3 w-3 mr-1" />
                <span className="text-xs opacity-70">Bot</span>
              </div>
              <div className="flex space-x-1 mt-1">
                <ThreeDotsLoading />
              </div>
            </div>
          </div>
        )}
        
        {liveSupportRequested && !adminJoined && (
          <div className="flex justify-start">
            <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-lg">
              <div className="flex items-center text-yellow-600">
                <Shield className="h-3 w-3 mr-1" />
                <span className="text-xs">Connecting to support</span>
              </div>
              <div className="flex mt-1 text-yellow-600">
                <ThreeDotsLoading />
              </div>
            </div>
          </div>
        )}
        
        {messages.length > 0 && showFaq && !liveSupportRequested && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              {faqList.slice(0, 5).map((faq, index) => (
                <button
                  key={index}
                  className="text-left text-xs bg-background border p-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => handleFaqSelect(faq.question, faq.answer)}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.length > 0 && !liveSupportRequested && (
          <div className="flex justify-center pt-2">
            <Button 
              onClick={handleLiveSupport} 
              variant="destructive"
              className="w-full"
            >
              <Phone className="mr-2 h-4 w-4" />
              Connect with Live Support
            </Button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-black text-white border border-muted focus:border-primary focus:ring-0"
          autoComplete="off"
          autoFocus={isOpen}
        />
        <Button type="submit" size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );

  const FloatingButton = () => (
    <SheetTrigger asChild>
      <Button
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 h-12 w-12 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </SheetTrigger>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <FloatingButton />
      <SheetContent side="right" className="p-0 w-80 sm:max-w-md">
        <ChatContent />
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;


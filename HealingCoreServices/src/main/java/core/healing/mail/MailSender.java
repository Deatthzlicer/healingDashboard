package core.healing.mail;

import java.util.Properties;
import javax.mail.Session;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailSender {
    
    private MailSender(){}

    // Set up mail server from application.properties
    private static final Properties properties = Reader.getProps();

    //public static void main(String[] args) {}

    public static void ok() {
        // Authenticate with the mail server
        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                    properties.getProperty("mail.user"), 
                    properties.getProperty("mail.password"));
            }
        });

        try {
            // Create a default MimeMessage object
            Reader.prn("Create a default MimeMessage object");
            MimeMessage message = new MimeMessage(session);

            // Set From: header field
            Reader.prn("Set From: header field");
            message.setFrom(new InternetAddress(properties.getProperty("mail.user")));

            // Set To: header field
            Reader.prn("Set To: header field");
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(properties.getProperty("mail.to")));

            // Set Subject: header field
            Reader.prn("Set Subject: header field");
            message.setSubject(properties.getProperty("mail.subject"));

            // Set the actual message
            Reader.prn("Set the actual message");
            message.setContent(properties.getProperty("mail.content"), "text/html");

            // Send message
            Reader.prn("Send message");
            Transport.send(message);

            Reader.prn("Sent message successfully....");
        } catch (Exception e) {
            e.printStackTrace();
            Reader.prn(e.getMessage());
        }
    }
}

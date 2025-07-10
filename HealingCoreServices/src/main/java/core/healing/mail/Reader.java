package core.healing.mail;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Reader {
    private Reader(){}
    public static Properties getProps() {
        Properties properties = new Properties();
        try {
            InputStream input = MailSender.class.getClassLoader().getResourceAsStream("application.properties");
            if (input == null) {
                prn("Sorry, unable to find application.properties");
                return properties;
            }
            // Load the properties file
            properties.load(input);
            return properties;
        } catch (IOException ex) {
            ex.printStackTrace();
            return properties;
        }        
    }
    public static void prn(String s) {
        System.out.println("---------->"+s);
    }
}

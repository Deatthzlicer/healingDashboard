package core.healing;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import core.healing.entities.view.DashboardDetails;
import core.healing.entities.view.MessageLog;
import core.healing.mail.MailSender;
import core.healing.services.HealingServices;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/fetchDashboardDetails")
public class HealingDashboardController {

    @Autowired
    HealingServices healingServices;
/**
 * 
 * This API endpoint will fetch a list of Patients destined for the healer on review for the purpose of the main Dashboard
 */   
     @RequestMapping( method = RequestMethod.GET, consumes = "application/json")
    @ResponseBody
    public DashboardDetails createEfetchDashboardDetailsample((Integer healerId) throws IOException {
    return healingServices.fetchDashboardDetails(healerId);
    }

/**
 * 
 * This API endpoint will provide the first Message to show on the Dashboard for  Service Performance and Optimization Utilization
 * 
 * Not based on Date but the first record in the source of Message Logs
 */  
    
    @RequestMapping( method = RequestMethod.GET, consumes = "application/json")
    @ResponseBody
    public MessageLog fetchMessageSample(Integer healerId, Integer patientId) {
    return healingServices.getSampleMessage(healerId,patientId);
    }


/**
 * 
 * This API endpoint will provide Messages based on Dates t Display on Patinet Details Dashboard for  Service Performance and Optimization Utilization
 */  
      @RequestMapping( method = RequestMethod.GET, consumes = "application/json")
    @ResponseBody
    public List<MessageLog> fetchMesasgeFromDate(Integer healerId, Integer patientId, Date dateToFetch) { 
return healingServices.fetchMessageFromDate(dateToFetch,healerId,patientId);
    }


    @RequestMapping( method = RequestMethod.GET, consumes = "application/json")
    @ResponseBody
    public DashboardDetails sendMessage() throws IOException {
        Reader.prn("You have new Message in the HealingApp" );
        MailSender.ok();        
        response.setContentType("application/json");
        
        response.setStatus(HttpServletResponse.SC_CREATED);
        MailSender.send(response);
    }
    
}

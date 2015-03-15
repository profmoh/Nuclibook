package nuclibook.routes;

import nuclibook.constants.P;
import nuclibook.entity_utils.*;
import nuclibook.models.*;
import org.joda.time.DateTime;
import org.json.JSONArray;
import org.json.JSONObject;
import spark.Request;
import spark.Response;

import java.net.URLDecoder;
import java.util.ArrayList;

public class NewBookingRouteStage3 extends DefaultRoute {

	@Override
	public Object handle(Request request, Response response) throws Exception {
		// necessary prelim routine
		prepareToHandle();

		// security check
		if (!SecurityUtils.requirePermission(P.EDIT_APPOINTMENTS, response)) return null;

		// get basic info from post
		Patient patient = PatientUtils.getPatient(request.queryParams("patient"));
		Therapy therapy = TherapyUtils.getTherapy(request.queryParams("therapy"));
		Camera camera = CameraUtils.getCamera(request.queryParams("camera"));
		Tracer tracer = TracerUtils.getTracer(request.queryParams("tracer"));
		String tracerDose = request.queryParams("tracer-dose");

		// get tracer order date
		DateTime tracerOrderDate = null;
		if (request.queryParams("no-tracer-order") == null || !request.queryParams("no-tracer-order").equals("1")) {
			tracerOrderDate = new DateTime("tracer-order-due");
		}

		// get assigned staff
		ArrayList<Staff> assignedStaff = new ArrayList<>();
		String[] assignedStaffIds = request.queryParams("assigned-staff").split(",");
		for (String staffId : assignedStaffIds) {
			if (!staffId.equals("0")) {
				Staff staff = StaffUtils.getStaff(staffId);
				if (staff != null) assignedStaff.add(staff);
			}
		}

		// get booking sections
		ArrayList<BookingSection> bookingSections = new ArrayList<>();
		JSONArray bookingSectionsJsonArray = new JSONArray(URLDecoder.decode(request.queryParams("booking-sections"), "UTF-8"));
		for (int i = 0; i < bookingSectionsJsonArray.length(); ++i) {
			JSONObject tempObject = bookingSectionsJsonArray.getJSONObject(i);
			BookingSection tempBookingSection = new BookingSection(new DateTime(tempObject.getString("startTime")), new DateTime(tempObject.getString("endTime")));
			bookingSections.add(tempBookingSection);
		}

		// check the data received - should have all be validated on the front end,
		// so just check that we got everything or fail
		if (patient == null
				|| therapy == null
				|| camera == null
				|| tracer == null
				|| tracerDose == null
				|| tracerDose.length() == 0
				|| assignedStaff.size() == 0
				|| bookingSections.size() == 0) {
			response.redirect("/");
			return null;
		}

		return "no fail";
	}
}

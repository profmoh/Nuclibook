package nuclibook.routes;

import nuclibook.entity_utils.BookingUtils;
import nuclibook.entity_utils.TracerOrderUtils;
import nuclibook.models.Booking;
import nuclibook.models.TracerOrder;
import nuclibook.server.HtmlRenderer;
import org.joda.time.DateTime;
import spark.Request;
import spark.Response;

import java.util.HashMap;
import java.util.List;

public class DaySummaryRoute extends DefaultRoute {

	@Override
	public Object handle(Request request, Response response) throws Exception {
        prepareToHandle();

        // start renderer
        HtmlRenderer renderer = getRenderer();
        renderer.setTemplateFile("day-summary.html");

        // Date today
        DateTime today = new DateTime();
        DateTime todayStart = today.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0);
        DateTime todayEnd = today.withHourOfDay(23).withMinuteOfHour(59).withSecondOfMinute(59);

        // get bookings happening today
        //TODO: Change this to read selected day rather than today
		List<Booking> bookings = BookingUtils.getBookingsByDateRange(todayStart, todayEnd);
		renderer.setCollection("bookings", bookings);

		// get unordered tracers that are required in the next three days
		List<TracerOrder> unorderedTracers = TracerOrderUtils.getTracerOrdersRequiredByDay(today.plusDays(3), true);
		renderer.setCollection("unordered-tracers", unorderedTracers);

		return renderer.render();

//        @Override
//        public HashMap<String, String> getHashMap() {
//            return new HashMap<String, String>() {{
//                put("message", getMessage());
//                put("link", getLink());
//                put("icon", getIcon());
//                put("badge-type", getBadgeType());
//                put("badge-text", getBadgeText());
//                put("has-badge", getBadgeText() == null ? "no" : "yes");
//            }};
//        }
    }
}

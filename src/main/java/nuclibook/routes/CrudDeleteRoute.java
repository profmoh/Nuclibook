package nuclibook.routes;

import nuclibook.constants.P;
import nuclibook.entity_utils.AbstractEntityUtils;
import nuclibook.entity_utils.SecurityUtils;
import nuclibook.models.*;
import spark.Request;
import spark.Response;

public class CrudDeleteRoute extends DefaultRoute {

	@Override
	public Object handle(Request request, Response response) throws Exception {
		prepareToHandle();

		// get request info
		String entityType = request.queryParams("entity-type");
		int entityId = 0;
		try {
			entityId = Integer.parseInt(request.queryParams("entity-id"));
		} catch (NumberFormatException e) {
			// leave it at zero
		}

		switch (entityType) {
			case "camera": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_CAMERAS)) {
					return "no_permission";
				}

				Camera entity = AbstractEntityUtils.getEntityById(Camera.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(Camera.class, entity);
				return "okay";
			}

			case "camera-type": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_CAMERAS)) {
					return "no_permission";
				}

				CameraType entity = AbstractEntityUtils.getEntityById(CameraType.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(CameraType.class, entity);
				return "okay";
			}

			case "patient": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_PATIENTS)) {
					return "no_permission";
				}

				Patient entity = AbstractEntityUtils.getEntityById(Patient.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(Patient.class, entity);
				return "okay";
			}

			case "staff": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_STAFF)) {
					return "no_permission";
				}

				Staff entity = AbstractEntityUtils.getEntityById(Staff.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(Staff.class, entity);
				return "okay";
			}

			case "staff-absence": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_STAFF_ABSENCES)) {
					return "no_permission";
				}

				StaffAbsence entity = AbstractEntityUtils.getEntityById(StaffAbsence.class, entityId);
				AbstractEntityUtils.deleteEntity(StaffAbsence.class, entity);
				return "okay";
			}

			case "staff-availability": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_STAFF_AVAILABILITIES)) {
					return "no_permission";
				}

				StaffAvailability entity = AbstractEntityUtils.getEntityById(StaffAvailability.class, entityId);
				AbstractEntityUtils.deleteEntity(StaffAvailability.class, entity);
				return "okay";
			}

			case "staff-role": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_STAFF_ROLES)) {
					return "no_permission";
				}

				StaffRole entity = AbstractEntityUtils.getEntityById(StaffRole.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(StaffRole.class, entity);
				return "okay";
			}

			case "therapy": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_THERAPIES)) {
					return "no_permission";
				}

				Therapy entity = AbstractEntityUtils.getEntityById(Therapy.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(Therapy.class, entity);
				return "okay";
			}

			case "tracer": {
				// permission
				if (SecurityUtils.getCurrentUser() == null || !SecurityUtils.getCurrentUser().hasPermission(P.EDIT_TRACERS)) {
					return "no_permission";
				}

				Tracer entity = AbstractEntityUtils.getEntityById(Tracer.class, entityId);
				entity.setEnabled(false);
				AbstractEntityUtils.updateEntity(Tracer.class, entity);
				return "okay";
			}
		}

		// fail safe
		return "error";
	}
}

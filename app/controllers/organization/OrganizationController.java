package controllers.organization;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.organization.organizations;

public class OrganizationController extends Controller {

	public static Result organization_info() {
        return ok(organizations.render());
    }
}

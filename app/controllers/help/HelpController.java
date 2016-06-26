package controllers.help;

import play.mvc.*;

import views.html.help.helps;

public class HelpController extends Controller {

    public static Result help() {
        return ok(helps.render("Your new application is ready."));
    }

}

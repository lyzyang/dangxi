package controllers.genealogy;

import java.util.ArrayList;
import java.util.List;

import models.UtilTool;
import models.genealogy.Appellation;
import models.genealogy.FamilyMember;
import models.genealogy.MemberRelationship;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import be.objectify.deadbolt.java.actions.Pattern;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.genealogy.familyMembers;
import views.html.genealogy.seeFamilyMembers;

/**
 * @author lyz
 *
 */
public class FamilyMemberController extends Controller {

	/**
	 * 获取html页面
	 */
	public static Result seeFamilyMembers_html() {
		return ok(seeFamilyMembers.render());
	}
	
	
	/**
	 * 获取成员
	 * @return
	 */
	public static Result familyMembers_get_life(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String name = in.get("name");
		String life = in.get("life");
		
		int ilife = 5;
		if(life != null && life.length() != 0){
			ilife = Integer.valueOf(life);
		}
		
		JsonNode json;
		if(sid == null || sid.length() == 0){
			List<FamilyMember>  fm_list = new ArrayList<FamilyMember>();
			if(name == null || name.length() == 0){
				FamilyMember fm = FamilyMember.finder.byId(1L);
				fm_list.add(fm);
			}else{
				fm_list = FamilyMember.finder.where().like("name", "%" + name + "%").findList();
			}
			
			if(fm_list.size() == 0){
				json = FamilyMember.getFamilyMemberFive(null,ilife);
			}else if(fm_list.size() == 1){
				json = FamilyMember.getFamilyMemberFive(fm_list.get(0),ilife);
			}else{
				ObjectMapper mapper = new ObjectMapper();
				ObjectNode sjson = mapper.createObjectNode ();
				sjson.put("type", "select");
				ArrayNode array = mapper.createArrayNode ();
				for(FamilyMember fm : fm_list){
					ObjectNode appJson = mapper.createObjectNode();
					appJson.put("id", fm.id);
					
					String text = "";
					for(MemberRelationship mrFather : fm.mrs2){
						if(mrFather.appellation.id == Appellation.CHILDREN){
							text = text + mrFather.fm1.name + "-";
						}
					}
					appJson.put("text", text + fm.name);
					
					array.add(appJson);
				}
				sjson.put("data", array);
				json = sjson;
			}
		}else{
			FamilyMember fm = FamilyMember.finder.byId(Long.valueOf(sid));
			json = FamilyMember.getFamilyMemberFive(fm,ilife);
		}
		 
		return ok(json);
	}
	
	//－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
	
	/**
	 * 获取html页面
	 */
	@Pattern("familyMembers_html")
	public static Result familyMembers_html() {
		return ok(familyMembers.render());
	}
	
	/**
	 * 获取成员详细信息
	 * @return
	 */
	@Pattern("familyMembers_html")
	public static Result familyMembers_get(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		JsonNode json;
		if(sid == null || sid.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		json = FamilyMember.getFamilyMember(Long.valueOf(sid));
		return ok(json);
	}
	
	
	/**
	 * 添加子女
	 * @return
	 */
	@Pattern("familyMembers_html")
	@Transactional
	public static Result familyMembers_children_add(){
		DynamicForm in = Form.form().bindFromRequest();
		String fm_id = in.get("fm_id");
		String name = in.get("name");
		String sex = in.get("sex");
		String residence = in.get("residence");
		String contact = in.get("contact");
		String remark = in.get("remark");
		
		JsonNode json;
		if(fm_id == null || fm_id.length()==0
				||name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FamilyMember fm = FamilyMember.finder.byId(Long.valueOf(fm_id));
		
		FamilyMember fm_children = new FamilyMember();
		fm_children.name = name;
		fm_children.sex = Integer.valueOf(sex);//0男 1女
		fm_children.residence = residence;//住址
		fm_children.contact = contact;//状态
		fm_children.remark = remark;//状态
		fm_children.statu = 0;
		fm_children.hdg = fm.hdg +1;
		fm_children.cdg = fm.cdg +1;
		fm_children.ybg = fm.ybg +1;
		fm_children.addFamilyMember();
		
		MemberRelationship mr_children = new MemberRelationship();
		Appellation appellation = new Appellation();
		appellation.id = Appellation.CHILDREN;
		mr_children.appellation = appellation;
		mr_children.fm1 = fm;
		mr_children.fm2 = fm_children;
		mr_children.addMemberRelationship();
		
		json = UtilTool.message(0, "添加成功!");
	
    	return ok(json);
	}
	
	
	/**
	 * 修改成员信息
	 * @return
	 */
	@Pattern("familyMembers_html")
	@Transactional
	public static Result familyMembers_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String fm_id = in.get("fm_id");
		String name = in.get("name");
		String sex = in.get("sex");
		String residence = in.get("residence");
		String contact = in.get("contact");
		String remark = in.get("remark");
		
		JsonNode json;
		if(fm_id == null || fm_id.length()==0
				||name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FamilyMember fm = FamilyMember.finder.byId(Long.valueOf(fm_id));
		fm.name = name;
		fm.sex = Integer.valueOf(sex);//0男 1女
		fm.residence = residence;//住址
		fm.contact = contact;//状态
		fm.remark = remark;//状态
		fm.updateFamilyMember();
		
		json = UtilTool.message(0, "修改成功!");
	
    	return ok(json);
	}
	
	/**
	 * 删除成员信息
	 * @return
	 */
	@Pattern("familyMembers_html")
	@Transactional
	public static Result familyMembers_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		JsonNode json;
		if(sid == null || sid.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FamilyMember father = new FamilyMember().delFamilyMember(Long.valueOf(sid));
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode jsonNode = mapper.createObjectNode();
		
		if(father != null){
			jsonNode.put("status", 0);
			jsonNode.put("mess", "删除成功!");
			jsonNode.put("fm_id", father.id);
			jsonNode.put("fm_name", father.name);
		}else{
			jsonNode.put("status", 1);
			jsonNode.put("mess", "含有子女，不能删除!");
		}
	
    	return ok(jsonNode);
	}
	
	
	
	/**
	 * 获取配偶信息
	 * @return
	 */
	@Pattern("familyMembers_html")
	public static Result familyMembers_get_spouse(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		JsonNode json;
		if(sid == null || sid.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		json = FamilyMember.getFamilyMemberSpouse(Long.valueOf(sid));
		return ok(json);
	}
	
	/**
	 * 添加配偶
	 * @return
	 */
	@Pattern("familyMembers_html")
	@Transactional
	public static Result familyMembers_spouse_add(){
		DynamicForm in = Form.form().bindFromRequest();
		String fm_id = in.get("fm_id");
		String name = in.get("name");
		String residence = in.get("residence");
		String statu = in.get("statu");
		
		JsonNode json;
		if(fm_id == null || fm_id.length()==0
				||name == null || name.length()==0
				||residence == null || residence.length()==0
				||statu == null || statu.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FamilyMember fm = FamilyMember.finder.byId(Long.valueOf(fm_id));
		
		FamilyMember fm_spouse = new FamilyMember();
		fm_spouse.name = name;
		if(fm.sex == 0){
			fm_spouse.sex = 1;//0男 1女
		}else{
			fm_spouse.sex = 0;//0男 1女
		}
		fm_spouse.residence = residence;//住址
		fm_spouse.statu = Integer.valueOf(statu);//状态
		fm_spouse.hdg = fm.hdg;
		fm_spouse.cdg = fm.cdg;
		fm_spouse.ybg = fm.ybg;
		fm_spouse.addFamilyMember();
		
		MemberRelationship mr_spouse = new MemberRelationship();
		Appellation appellation = new Appellation();
		appellation.id = Appellation.SPOUSE;
		mr_spouse.appellation = appellation;
		mr_spouse.fm1 = fm;
		mr_spouse.fm2 = fm_spouse;
		mr_spouse.addMemberRelationship();
		
		json = UtilTool.message(0, "添加成功!");
	
    	return ok(json);
	}
	
	/**
	 * 修改配偶
	 * @return
	 */
	@Pattern("familyMembers_html")
	@Transactional
	public static Result familyMembers_spouse_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String name = in.get("name");
		String residence = in.get("residence");
		String statu = in.get("statu");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||name == null || name.length()==0
				||residence == null || residence.length()==0
				||statu == null || statu.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FamilyMember fm_spouse = FamilyMember.finder.byId(Long.valueOf(sid));
		fm_spouse.name = name;
		fm_spouse.residence = residence;//住址
		fm_spouse.statu = Integer.valueOf(statu);//状态
		fm_spouse.updateFamilyMember();
		
		json = UtilTool.message(0, "修改成功!");
	
    	return ok(json);
	}
	
	
	/**
	 * 删除配偶
	 * @return
	 */
	@Pattern("familyMembers_html")
	@Transactional
	public static Result familyMembers_spouse_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		JsonNode json;
		if(sid == null || sid.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		new FamilyMember().delFamilyMemberSpouse(Long.valueOf(sid));
		
		json = UtilTool.message(0, "删除成功!");
	
    	return ok(json);
	}
	
}

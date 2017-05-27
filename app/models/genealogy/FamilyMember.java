package models.genealogy;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class FamilyMember extends Model {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	public String name;
	public Integer sex;//0男 1女
	public String residence;//住址
	public String contact;//联系
	public String remark;//说明
	public Integer statu;//婚姻状态 0正常 1离异
	public Integer hdg;
	public Integer cdg;
	public Integer ybg;
	
	@OneToMany(mappedBy="fm1", fetch = FetchType.LAZY)
	public List<MemberRelationship> mrs1;//主
	
	@OneToMany(mappedBy="fm2", fetch = FetchType.LAZY)
	public List<MemberRelationship> mrs2;//次
	
	public static final Finder<Long, FamilyMember> finder = new Finder<Long, FamilyMember>(Long.class, FamilyMember.class);
	
	/**
	 * 获取
	 * @param id
	 * @return
	 */
	public static JsonNode getFamilyMemberFive(FamilyMember fm,int life){
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		ObjectNode fmFatherJson = mapper.createObjectNode();
		
		if(fm == null){
			json.put("type", "empty");
			return json;
		}else{
			json.put("type", "tree");
		}
		
		int qh_life = (life - 1)/2;
		
		int q_life = qh_life;
		FamilyMember fatherFm = fm;
		while(q_life > 0){
			if(fatherFm.mrs2.size() > 0){
				int ck = q_life;
				for(MemberRelationship mrFather : fatherFm.mrs2){
					if(mrFather.appellation.id == Appellation.CHILDREN){//判断父亲
						fatherFm = mrFather.fm1;
						q_life--;
					}
				}
				if(ck == q_life) {
					break;
				}
			}else{
				break;
			}
		}
		

		switch(life){
			case 5 :
				fmFatherJson = getFamilyMemberFive(fatherFm);
				break;
			case 7 :
				fmFatherJson = getFamilyMemberSeven(fatherFm);
				break;
			case 9 :
				fmFatherJson = getFamilyMemberNine(fatherFm);
				break;
			case 11 :
				fmFatherJson = getFamilyMemberEleven(fatherFm);
				break;
		}
	
		json.put("data", fmFatherJson);
		return json;
	}
	
	/**
	 * 五世数据
	 * @param fatherFm
	 * @return
	 */
	private static ObjectNode getFamilyMemberFive(FamilyMember fatherFm){
		ObjectMapper mapper = new ObjectMapper();
		
		ObjectNode fmFatherJson = getFamilyMemberChildren(fatherFm);
		ArrayNode childrenArray = (ArrayNode)fmFatherJson.get("children");
		ArrayNode newChildrenArray = mapper.createArrayNode ();
		for(JsonNode childrenJson : childrenArray){
			ObjectNode newChildrenJson = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson.get("id").asLong()));
			
			ArrayNode childrenArray2 = (ArrayNode)newChildrenJson.get("children");
			ArrayNode newChildrenArray2 = mapper.createArrayNode ();
			for(JsonNode childrenJson2 : childrenArray2){
				ObjectNode newChildrenJson2 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson2.get("id").asLong()));
				
				ArrayNode childrenArray3 = (ArrayNode)newChildrenJson2.get("children");
				ArrayNode newChildrenArray3 = mapper.createArrayNode ();
				for(JsonNode childrenJson3 : childrenArray3){
					ObjectNode newChildrenJson3 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson3.get("id").asLong()));
					
					newChildrenArray3.add(newChildrenJson3);
				}
				newChildrenJson2.put("children", newChildrenArray3);
				
				newChildrenArray2.add(newChildrenJson2);
			}
			newChildrenJson.put("children", newChildrenArray2);
			
			newChildrenArray.add(newChildrenJson);
		}
		fmFatherJson.put("children", newChildrenArray);
		
		return fmFatherJson;
	}
	
	/**
	 * 七世数据
	 * @param fatherFm
	 * @return
	 */
	private static ObjectNode getFamilyMemberSeven(FamilyMember fatherFm){
		ObjectMapper mapper = new ObjectMapper();
		
		ObjectNode fmFatherJson = getFamilyMemberChildren(fatherFm);
		ArrayNode childrenArray = (ArrayNode)fmFatherJson.get("children");
		ArrayNode newChildrenArray = mapper.createArrayNode ();
		for(JsonNode childrenJson : childrenArray){
			ObjectNode newChildrenJson = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson.get("id").asLong()));
			
			ArrayNode childrenArray2 = (ArrayNode)newChildrenJson.get("children");
			ArrayNode newChildrenArray2 = mapper.createArrayNode ();
			for(JsonNode childrenJson2 : childrenArray2){
				ObjectNode newChildrenJson2 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson2.get("id").asLong()));
				
				ArrayNode childrenArray3 = (ArrayNode)newChildrenJson2.get("children");
				ArrayNode newChildrenArray3 = mapper.createArrayNode ();
				for(JsonNode childrenJson3 : childrenArray3){
					ObjectNode newChildrenJson3 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson3.get("id").asLong()));
					
					ArrayNode childrenArray4 = (ArrayNode)newChildrenJson3.get("children");
					ArrayNode newChildrenArray4 = mapper.createArrayNode ();
					for(JsonNode childrenJson4 : childrenArray4){
						ObjectNode newChildrenJson4 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson4.get("id").asLong()));
					
						ArrayNode childrenArray5 = (ArrayNode)newChildrenJson4.get("children");
						ArrayNode newChildrenArray5 = mapper.createArrayNode ();
						for(JsonNode childrenJson5 : childrenArray5){
							ObjectNode newChildrenJson5 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson5.get("id").asLong()));
						
							newChildrenArray5.add(newChildrenJson5);
						}
						newChildrenJson4.put("children", newChildrenArray5);
						
						newChildrenArray4.add(newChildrenJson4);
					}
					newChildrenJson3.put("children", newChildrenArray4);
					
					newChildrenArray3.add(newChildrenJson3);
				}
				newChildrenJson2.put("children", newChildrenArray3);
				
				newChildrenArray2.add(newChildrenJson2);
			}
			newChildrenJson.put("children", newChildrenArray2);
			
			newChildrenArray.add(newChildrenJson);
		}
		fmFatherJson.put("children", newChildrenArray);
		
		return fmFatherJson;
	}
	
	/**
	 * 九世数据
	 * @param fatherFm
	 * @return
	 */
	private static ObjectNode getFamilyMemberNine(FamilyMember fatherFm){
		ObjectMapper mapper = new ObjectMapper();
		
		ObjectNode fmFatherJson = getFamilyMemberChildren(fatherFm);
		ArrayNode childrenArray = (ArrayNode)fmFatherJson.get("children");
		ArrayNode newChildrenArray = mapper.createArrayNode ();
		for(JsonNode childrenJson : childrenArray){
			ObjectNode newChildrenJson = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson.get("id").asLong()));
			
			ArrayNode childrenArray2 = (ArrayNode)newChildrenJson.get("children");
			ArrayNode newChildrenArray2 = mapper.createArrayNode ();
			for(JsonNode childrenJson2 : childrenArray2){
				ObjectNode newChildrenJson2 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson2.get("id").asLong()));
				
				ArrayNode childrenArray3 = (ArrayNode)newChildrenJson2.get("children");
				ArrayNode newChildrenArray3 = mapper.createArrayNode ();
				for(JsonNode childrenJson3 : childrenArray3){
					ObjectNode newChildrenJson3 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson3.get("id").asLong()));
					
					ArrayNode childrenArray4 = (ArrayNode)newChildrenJson3.get("children");
					ArrayNode newChildrenArray4 = mapper.createArrayNode ();
					for(JsonNode childrenJson4 : childrenArray4){
						ObjectNode newChildrenJson4 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson4.get("id").asLong()));
					
						ArrayNode childrenArray5 = (ArrayNode)newChildrenJson4.get("children");
						ArrayNode newChildrenArray5 = mapper.createArrayNode ();
						for(JsonNode childrenJson5 : childrenArray5){
							ObjectNode newChildrenJson5 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson5.get("id").asLong()));
						
							ArrayNode childrenArray6 = (ArrayNode)newChildrenJson5.get("children");
							ArrayNode newChildrenArray6 = mapper.createArrayNode ();
							for(JsonNode childrenJson6 : childrenArray6){
								ObjectNode newChildrenJson6 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson6.get("id").asLong()));
							
								ArrayNode childrenArray7 = (ArrayNode)newChildrenJson6.get("children");
								ArrayNode newChildrenArray7 = mapper.createArrayNode ();
								for(JsonNode childrenJson7 : childrenArray7){
									ObjectNode newChildrenJson7 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson7.get("id").asLong()));
									
									newChildrenArray7.add(newChildrenJson7);
								}
								newChildrenJson6.put("children", newChildrenArray7);
								
								newChildrenArray6.add(newChildrenJson6);
							}
							newChildrenJson5.put("children", newChildrenArray6);
							
							newChildrenArray5.add(newChildrenJson5);
						}
						newChildrenJson4.put("children", newChildrenArray5);
						
						newChildrenArray4.add(newChildrenJson4);
					}
					newChildrenJson3.put("children", newChildrenArray4);
					
					newChildrenArray3.add(newChildrenJson3);
				}
				newChildrenJson2.put("children", newChildrenArray3);
				
				newChildrenArray2.add(newChildrenJson2);
			}
			newChildrenJson.put("children", newChildrenArray2);
			
			newChildrenArray.add(newChildrenJson);
		}
		fmFatherJson.put("children", newChildrenArray);
		
		return fmFatherJson;
	}
	
	/**
	 * 十一世数据
	 * @param fatherFm
	 * @return
	 */
	private static ObjectNode getFamilyMemberEleven(FamilyMember fatherFm){
		ObjectMapper mapper = new ObjectMapper();
		
		ObjectNode fmFatherJson = getFamilyMemberChildren(fatherFm);
		ArrayNode childrenArray = (ArrayNode)fmFatherJson.get("children");
		ArrayNode newChildrenArray = mapper.createArrayNode ();
		for(JsonNode childrenJson : childrenArray){
			ObjectNode newChildrenJson = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson.get("id").asLong()));
			
			ArrayNode childrenArray2 = (ArrayNode)newChildrenJson.get("children");
			ArrayNode newChildrenArray2 = mapper.createArrayNode ();
			for(JsonNode childrenJson2 : childrenArray2){
				ObjectNode newChildrenJson2 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson2.get("id").asLong()));
				
				ArrayNode childrenArray3 = (ArrayNode)newChildrenJson2.get("children");
				ArrayNode newChildrenArray3 = mapper.createArrayNode ();
				for(JsonNode childrenJson3 : childrenArray3){
					ObjectNode newChildrenJson3 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson3.get("id").asLong()));
					
					ArrayNode childrenArray4 = (ArrayNode)newChildrenJson3.get("children");
					ArrayNode newChildrenArray4 = mapper.createArrayNode ();
					for(JsonNode childrenJson4 : childrenArray4){
						ObjectNode newChildrenJson4 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson4.get("id").asLong()));
					
						ArrayNode childrenArray5 = (ArrayNode)newChildrenJson4.get("children");
						ArrayNode newChildrenArray5 = mapper.createArrayNode ();
						for(JsonNode childrenJson5 : childrenArray5){
							ObjectNode newChildrenJson5 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson5.get("id").asLong()));
						
							ArrayNode childrenArray6 = (ArrayNode)newChildrenJson5.get("children");
							ArrayNode newChildrenArray6 = mapper.createArrayNode ();
							for(JsonNode childrenJson6 : childrenArray6){
								ObjectNode newChildrenJson6 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson6.get("id").asLong()));
							
								ArrayNode childrenArray7 = (ArrayNode)newChildrenJson6.get("children");
								ArrayNode newChildrenArray7 = mapper.createArrayNode ();
								for(JsonNode childrenJson7 : childrenArray7){
									ObjectNode newChildrenJson7 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson7.get("id").asLong()));
									
									ArrayNode childrenArray8 = (ArrayNode)newChildrenJson7.get("children");
									ArrayNode newChildrenArray8 = mapper.createArrayNode ();
									for(JsonNode childrenJson8 : childrenArray8){
										ObjectNode newChildrenJson8 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson8.get("id").asLong()));
									
										ArrayNode childrenArray9 = (ArrayNode)newChildrenJson8.get("children");
										ArrayNode newChildrenArray9 = mapper.createArrayNode ();
										for(JsonNode childrenJson9 : childrenArray9){
											ObjectNode newChildrenJson9 = getFamilyMemberChildren(FamilyMember.finder.byId(childrenJson9.get("id").asLong()));
											
											newChildrenArray9.add(newChildrenJson9);
										}
										newChildrenJson8.put("children", newChildrenArray9);
										
										newChildrenArray8.add(newChildrenJson8);
									}
									newChildrenJson7.put("children", newChildrenArray8);
									
									newChildrenArray7.add(newChildrenJson7);
								}
								newChildrenJson6.put("children", newChildrenArray7);
								
								newChildrenArray6.add(newChildrenJson6);
							}
							newChildrenJson5.put("children", newChildrenArray6);
							
							newChildrenArray5.add(newChildrenJson5);
						}
						newChildrenJson4.put("children", newChildrenArray5);
						
						newChildrenArray4.add(newChildrenJson4);
					}
					newChildrenJson3.put("children", newChildrenArray4);
					
					newChildrenArray3.add(newChildrenJson3);
				}
				newChildrenJson2.put("children", newChildrenArray3);
				
				newChildrenArray2.add(newChildrenJson2);
			}
			newChildrenJson.put("children", newChildrenArray2);
			
			newChildrenArray.add(newChildrenJson);
		}
		fmFatherJson.put("children", newChildrenArray);
		
		return fmFatherJson;
	}
	
	/**
	 * 获取成员及子女信息
	 * @param fm
	 * @return
	 */
	private static ObjectNode getFamilyMemberChildren(FamilyMember fm){
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode fmJson = getFamilyMemberJson(fm);
		
		ArrayNode fmChildrenArray = mapper.createArrayNode ();
		for(MemberRelationship mr : fm.mrs1){
			if(mr.appellation.id == Appellation.CHILDREN){
				ObjectNode fmChildrenJson = getFamilyMemberJson(mr.fm2);
				fmChildrenArray.add(fmChildrenJson);
			}
		}
		fmJson.put("children", fmChildrenArray);
		return fmJson;
	}
	
	/**
	 * 获取成员展示信息
	 * @param fm
	 * @return
	 */
	private static ObjectNode getFamilyMemberJson(FamilyMember fm){
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode fmJson = mapper.createObjectNode();
		fmJson.put("id", fm.id);
		fmJson.put("sname", fm.name);
		fmJson.put("sex", fm.sex);
		if(fm.sex == 0){
			fmJson.put("name", fm.name + "(男)");
		}else{
			fmJson.put("name", fm.name + "(女)");
		}
		
		ObjectNode fmContentJson = mapper.createObjectNode();
		if(fm.hdg > 1) fmContentJson.put("火德公", "第" + fm.hdg + "世" );
		if(fm.hdg == 1) fmContentJson.put("火德公", "始祖");
		
		if(fm.cdg > 1) fmContentJson.put("纯敦公", "第" + fm.cdg + "世" );
		if(fm.cdg == 1) fmContentJson.put("德明公", "梅县始祖");
		
		if(fm.ybg > 1) fmContentJson.put("衍白公", "第" + fm.hdg + "世" );
		if(fm.ybg == 1) fmContentJson.put("衍白公", "唐溪始祖");
		
		if(fm.residence != null && fm.residence.length() != 0) fmContentJson.put("住址", fm.residence);
		if(fm.contact != null && fm.contact.length() != 0) fmContentJson.put("联系", fm.contact);
		if(fm.remark != null && fm.remark.length() != 0) fmContentJson.put("简介", fm.remark);
		
		for(MemberRelationship mrSpouse : fm.mrs1){
			if(mrSpouse.appellation.id == Appellation.SPOUSE){
				if(mrSpouse.fm2.statu == 1){
					fmContentJson.put("配偶(离异)", mrSpouse.fm2.name);
				}else{
					fmContentJson.put("配偶", mrSpouse.fm2.name);
				}
				if(mrSpouse.fm2.residence != null && mrSpouse.fm2.residence.length() != 0)
					fmContentJson.put("配偶住址", mrSpouse.fm2.residence);
			}
		}
		fmJson.put("content", fmContentJson);
		
		return fmJson;
	}
	
	
	/**
	 * 获取成员详细信息
	 * @param id
	 * @return
	 */
	public static JsonNode getFamilyMember(long id){
		FamilyMember fm = FamilyMember.finder.byId(id);
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode fmJson = mapper.createObjectNode();
		fmJson.put("id", fm.id);
		fmJson.put("name", fm.name);
		fmJson.put("sex", fm.sex);
		fmJson.put("residence", fm.residence);
		fmJson.put("contact", fm.contact);
		fmJson.put("remark", fm.remark);
		
		return fmJson;
	}
	
	/**
	 * 获取世代
	 * @param id
	 * @return
	 */
	public static int getFamilyMemberLife(long id){
		FamilyMember fm = FamilyMember.finder.byId(id);
		
		int life = 0;
		boolean isHasFather = true;
		do{
			boolean fs = false;
			for(MemberRelationship mr : fm.mrs2){
				if(mr.appellation.id == Appellation.CHILDREN){
					fs = true;
					fm = mr.fm1;
				}
			}
			if(fs){
				life =  life + 1;
			}else{
				isHasFather = false;
			}
		}while(isHasFather);
		
		return life;
	}
	
	/**
	 * 获取配偶
	 * @param id
	 * @return
	 */
	public static JsonNode getFamilyMemberSpouse(long id){
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode spouseArray = mapper.createArrayNode ();
		
		FamilyMember fm = FamilyMember.finder.byId(id);
		for(MemberRelationship mrSpouse : fm.mrs1){
			if(mrSpouse.appellation.id == Appellation.SPOUSE){
				ObjectNode spouseJson = mapper.createObjectNode();
				spouseJson.put("id", mrSpouse.fm2.id);
				spouseJson.put("text", mrSpouse.fm2.name);
				spouseJson.put("name", mrSpouse.fm2.name);
				spouseJson.put("sex", mrSpouse.fm2.sex);
				spouseJson.put("residence", mrSpouse.fm2.residence);
				spouseJson.put("statu", mrSpouse.fm2.statu);
				
				spouseArray.add(spouseJson);
			}
		}
		
		return spouseArray;
	}
	
	/**
	 * 添加成员
	 */
	public void addFamilyMember(){
		this.save();
	}
	
	/**
	 * 修改成员
	 */
	public void updateFamilyMember(){
		this.update();
	}
	
	/**
	 * 删除成员
	 * @param id
	 * @return 
	 */
	public FamilyMember delFamilyMember(Long id){
		FamilyMember fm = finder.byId(id);
		
		int childrens = 0;
		for(MemberRelationship mrChildren : fm.mrs1){
			if(mrChildren.appellation.id == Appellation.CHILDREN){
				childrens++;
			}
		}
		
		FamilyMember father = null;
		if(childrens == 0){
			for(MemberRelationship mrSpouse : fm.mrs1){
				if(mrSpouse.appellation.id == Appellation.SPOUSE){
					FamilyMember spouse = mrSpouse.fm2;
					mrSpouse.delete();
					spouse.delete();
				}
			}
			
			for(MemberRelationship mrFather : fm.mrs2){
				father = mrFather.fm1;
				mrFather.delete();
			}
			fm.delete();
			
			return father;
		}else{
			return father;
		}
	}
	
	/**
	 * 删除配偶
	 * @param id
	 */
	public void delFamilyMemberSpouse(Long id){
		FamilyMember spouse = finder.byId(id);
		for(MemberRelationship mrSpouse : spouse.mrs2){
			if(mrSpouse.appellation.id == Appellation.SPOUSE){
				mrSpouse.delete();
			}
		}
		spouse.delete();
	}
}

package models.genealogy;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class MemberRelationship extends Model {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	@ManyToOne
	public Appellation appellation;
	
	@ManyToOne
	public FamilyMember fm1;//主
	
	@ManyToOne
	public FamilyMember fm2;//次
	
	public static final Finder<Long, MemberRelationship> finder = new Finder<Long, MemberRelationship>(Long.class, MemberRelationship.class);
	
	
	public void addMemberRelationship(){
		this.save();
	}
	
	public void updateMemberRelationship(){
		this.update();
	}
	
	public void delMemberRelationship(long id){
		MemberRelationship mr = finder.byId(id);
		mr.delete();
	}
}

"use strict";(self["webpackChunkbadminton_registration"]=self["webpackChunkbadminton_registration"]||[]).push([[172],{4172:function(t,e,a){a.r(e),a.d(e,{default:function(){return J}});var s=a(6768),l=a(4232),n=a(5130);const i={class:"registration-management"},d={class:"container py-4"},o={class:"card mb-4"},r={class:"card-body"},c={class:"row"},u={class:"col-md-4 mb-3"},k=["value"],m={class:"col-md-4 mb-3"},b={class:"col-md-4 mb-3 d-flex align-items-end"},L={class:"card"},p={class:"card-body"},v={key:0,class:"text-center py-4"},g={key:1,class:"text-center py-4"},y={key:2},h={class:"table-responsive"},f={class:"table table-striped"},w=["onClick"],C=["onClick"],R=["onClick"],E={class:"modal fade",id:"registrationDetailModal",tabindex:"-1","aria-labelledby":"registrationDetailModalLabel","aria-hidden":"true"},S={class:"modal-dialog modal-lg"},_={class:"modal-content"},I={key:0,class:"modal-body"},X={class:"mb-4"},D={class:"table table-bordered"},x={key:0},K={class:"mb-4"},M={class:"table table-bordered"},P={key:0,class:"mt-3"};function F(t,e,a,F,O,A){return(0,s.uX)(),(0,s.CE)("div",i,[(0,s.Lk)("div",d,[e[13]||(e[13]=(0,s.Lk)("h1",null,"報名管理",-1)),(0,s.Lk)("div",o,[e[8]||(e[8]=(0,s.Lk)("div",{class:"card-header bg-primary text-white"},[(0,s.Lk)("h5",{class:"mb-0"},"篩選報名記錄")],-1)),(0,s.Lk)("div",r,[(0,s.Lk)("div",c,[(0,s.Lk)("div",u,[e[5]||(e[5]=(0,s.Lk)("label",{for:"filterSession",class:"form-label"},"場次",-1)),(0,s.bo)((0,s.Lk)("select",{id:"filterSession",class:"form-select","onUpdate:modelValue":e[0]||(e[0]=t=>F.filterOptions.sessionId=t)},[e[4]||(e[4]=(0,s.Lk)("option",{value:""},"全部場次",-1)),((0,s.uX)(!0),(0,s.CE)(s.FK,null,(0,s.pI)(F.sessions,(t=>((0,s.uX)(),(0,s.CE)("option",{key:t.id,value:t.id},(0,l.v_)(t.title),9,k)))),128))],512),[[n.u1,F.filterOptions.sessionId]])]),(0,s.Lk)("div",m,[e[7]||(e[7]=(0,s.Lk)("label",{for:"filterPayment",class:"form-label"},"付款狀態",-1)),(0,s.bo)((0,s.Lk)("select",{id:"filterPayment",class:"form-select","onUpdate:modelValue":e[1]||(e[1]=t=>F.filterOptions.paymentStatus=t)},e[6]||(e[6]=[(0,s.Lk)("option",{value:""},"全部狀態",-1),(0,s.Lk)("option",{value:"已付款"},"已付款",-1),(0,s.Lk)("option",{value:"未付款"},"未付款",-1)]),512),[[n.u1,F.filterOptions.paymentStatus]])]),(0,s.Lk)("div",b,[(0,s.Lk)("button",{class:"btn btn-primary w-100",onClick:e[2]||(e[2]=(...t)=>F.applyFilters&&F.applyFilters(...t))},"套用篩選")])])])]),(0,s.Lk)("div",L,[e[12]||(e[12]=(0,s.Lk)("div",{class:"card-header bg-secondary text-white"},[(0,s.Lk)("h5",{class:"mb-0"},"報名記錄")],-1)),(0,s.Lk)("div",p,[F.loading?((0,s.uX)(),(0,s.CE)("div",v,e[9]||(e[9]=[(0,s.Lk)("div",{class:"spinner-border text-primary",role:"status"},[(0,s.Lk)("span",{class:"visually-hidden"},"載入中...")],-1),(0,s.Lk)("p",null,"載入報名記錄...",-1)]))):0===F.filteredRegistrations.length?((0,s.uX)(),(0,s.CE)("div",g,e[10]||(e[10]=[(0,s.Lk)("p",null,"沒有找到符合條件的報名記錄",-1)]))):((0,s.uX)(),(0,s.CE)("div",y,[(0,s.Lk)("div",h,[(0,s.Lk)("table",f,[e[11]||(e[11]=(0,s.Lk)("thead",null,[(0,s.Lk)("tr",null,[(0,s.Lk)("th",null,"場次"),(0,s.Lk)("th",null,"報名者"),(0,s.Lk)("th",null,"參加人數"),(0,s.Lk)("th",null,"報名時間"),(0,s.Lk)("th",null,"付款狀態"),(0,s.Lk)("th",null,"操作")])],-1)),(0,s.Lk)("tbody",null,[((0,s.uX)(!0),(0,s.CE)(s.FK,null,(0,s.pI)(F.filteredRegistrations,(t=>((0,s.uX)(),(0,s.CE)("tr",{key:t.id},[(0,s.Lk)("td",null,(0,l.v_)(F.getSessionTitle(t.sessionId)),1),(0,s.Lk)("td",null,(0,l.v_)(t.participants[0].name),1),(0,s.Lk)("td",null,(0,l.v_)(t.participants.length),1),(0,s.Lk)("td",null,(0,l.v_)(F.formatDate(t.timestamp)),1),(0,s.Lk)("td",null,[(0,s.Lk)("span",{class:(0,l.C4)("已付款"===t.paymentStatus?"badge bg-success":"badge bg-warning")},(0,l.v_)(t.paymentStatus),3)]),(0,s.Lk)("td",null,["已付款"!==t.paymentStatus?((0,s.uX)(),(0,s.CE)("button",{key:0,class:"btn btn-sm btn-outline-success me-1",onClick:e=>F.markAsPaid(t.id)}," 標記為已付款 ",8,w)):(0,s.Q3)("",!0),(0,s.Lk)("button",{class:"btn btn-sm btn-outline-info me-1",onClick:e=>F.viewRegistrationDetails(t)}," 查看詳情 ",8,C),(0,s.Lk)("button",{class:"btn btn-sm btn-outline-danger",onClick:e=>F.deleteRegistration(t.id,t.sessionId,t.participants.length)}," 移除報名 ",8,R)])])))),128))])])])]))])])]),(0,s.Lk)("div",E,[(0,s.Lk)("div",S,[(0,s.Lk)("div",_,[e[20]||(e[20]=(0,s.Lk)("div",{class:"modal-header"},[(0,s.Lk)("h5",{class:"modal-title",id:"registrationDetailModalLabel"},"報名詳情"),(0,s.Lk)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),F.selectedRegistration?((0,s.uX)(),(0,s.CE)("div",I,[(0,s.Lk)("div",X,[e[18]||(e[18]=(0,s.Lk)("h5",null,"場次資訊",-1)),(0,s.Lk)("table",D,[(0,s.Lk)("tbody",null,[(0,s.Lk)("tr",null,[e[14]||(e[14]=(0,s.Lk)("th",{width:"120"},"場次名稱",-1)),(0,s.Lk)("td",null,(0,l.v_)(F.getSessionTitle(F.selectedRegistration.sessionId)),1)]),(0,s.Lk)("tr",null,[e[15]||(e[15]=(0,s.Lk)("th",null,"報名時間",-1)),(0,s.Lk)("td",null,(0,l.v_)(F.formatDate(F.selectedRegistration.timestamp)),1)]),(0,s.Lk)("tr",null,[e[16]||(e[16]=(0,s.Lk)("th",null,"付款狀態",-1)),(0,s.Lk)("td",null,[(0,s.Lk)("span",{class:(0,l.C4)("已付款"===F.selectedRegistration.paymentStatus?"badge bg-success":"badge bg-warning")},(0,l.v_)(F.selectedRegistration.paymentStatus),3)])]),F.selectedRegistration.notes?((0,s.uX)(),(0,s.CE)("tr",x,[e[17]||(e[17]=(0,s.Lk)("th",null,"備註",-1)),(0,s.Lk)("td",null,(0,l.v_)(F.selectedRegistration.notes),1)])):(0,s.Q3)("",!0)])])]),(0,s.Lk)("div",K,[(0,s.Lk)("h5",null,"參加者清單 (共 "+(0,l.v_)(F.selectedRegistration.participants.length)+" 人)",1),(0,s.Lk)("table",M,[e[19]||(e[19]=(0,s.Lk)("thead",null,[(0,s.Lk)("tr",null,[(0,s.Lk)("th",null,"#"),(0,s.Lk)("th",null,"姓名"),(0,s.Lk)("th",null,"電話"),(0,s.Lk)("th",null,"電子郵件")])],-1)),(0,s.Lk)("tbody",null,[((0,s.uX)(!0),(0,s.CE)(s.FK,null,(0,s.pI)(F.selectedRegistration.participants,((t,e)=>((0,s.uX)(),(0,s.CE)("tr",{key:e},[(0,s.Lk)("td",null,(0,l.v_)(e+1),1),(0,s.Lk)("td",null,(0,l.v_)(t.name),1),(0,s.Lk)("td",null,(0,l.v_)(t.phone),1),(0,s.Lk)("td",null,(0,l.v_)(t.email),1)])))),128))])])]),"已付款"!==F.selectedRegistration.paymentStatus?((0,s.uX)(),(0,s.CE)("div",P,[(0,s.Lk)("button",{class:"btn btn-success",onClick:e[3]||(e[3]=t=>F.markAsPaid(F.selectedRegistration.id))}," 標記為已付款 ")])):(0,s.Q3)("",!0)])):(0,s.Q3)("",!0),e[21]||(e[21]=(0,s.Lk)("div",{class:"modal-footer"},[(0,s.Lk)("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"關閉")],-1))])])])])}a(4114),a(8111),a(2489),a(116),a(1701);var O=a(144),A=a(7617),G=a(3831),H=a(1394),Q=a(1387),T={name:"RegistrationManagement",setup(){const t=(0,Q.rd)(),e=(0,O.KR)([]),a=(0,O.KR)([]),l=(0,O.KR)(!0),n=(0,O.KR)(null),i=(0,O.KR)(null),d=(0,O.KR)({sessionId:"",paymentStatus:""});let o=null;(0,s.sV)((()=>{(0,G.hg)(H.j2,(async e=>{if(e){n.value=e;const a=await(0,A.x7)((0,A.H9)(H.db,"users",e.uid));a.exists()&&"admin"===a.data().role?(await r(),await c()):(alert("您沒有管理員權限"),t.push("/dashboard"))}else t.push("/login")})),"undefined"!==typeof window&&window.bootstrap&&(o=new window.bootstrap.Modal(document.getElementById("registrationDetailModal")))}));const r=async()=>{try{const t=(0,A.P)((0,A.rJ)(H.db,"sessions"),(0,A.My)("date","desc")),e=await(0,A.GG)(t);a.value=e.docs.map((t=>({id:t.id,...t.data(),date:t.data().date.toDate()})))}catch(t){console.error("Error fetching sessions:",t),alert("載入場次資料失敗，請稍後再試")}},c=async()=>{try{l.value=!0;const t=(0,A.P)((0,A.rJ)(H.db,"registrations"),(0,A.My)("timestamp","desc")),a=await(0,A.GG)(t);e.value=a.docs.map((t=>({id:t.id,...t.data(),timestamp:t.data().timestamp?.toDate()||new Date})))}catch(t){console.error("Error fetching registrations:",t),alert("載入報名記錄失敗，請稍後再試")}finally{l.value=!1}},u=t=>{const e=a.value.find((e=>e.id===t));return e?e.title:"未知場次"},k=()=>{},m=async t=>{const a=confirm("確定將此報名標記為已付款？");if(a)try{await(0,A.mZ)((0,A.H9)(H.db,"registrations",t),{paymentStatus:"已付款",paidAt:(0,A.O5)(),updatedBy:n.value.uid});const a=e.value.findIndex((e=>e.id===t));-1!==a&&(e.value[a].paymentStatus="已付款"),o&&o.hide(),alert("已成功標記為已付款")}catch(s){console.error("Error marking as paid:",s),alert("操作失敗，請稍後再試")}},b=t=>{i.value=t,o&&o.show()},L=async(t,a,s)=>{const l=confirm("確定要移除此報名記錄？此操作無法還原");if(l)try{await(0,A.kd)((0,A.H9)(H.db,"registrations",t));const l=(0,A.H9)(H.db,"sessions",a);await(0,A.mZ)(l,{currentParticipants:(0,A.GV)(-s)}),e.value=e.value.filter((e=>e.id!==t)),alert("報名記錄已成功移除")}catch(n){console.error("Error deleting registration:",n),alert("移除報名失敗，請稍後再試")}},p=(0,s.EW)((()=>{let t=[...e.value];return d.value.sessionId&&(t=t.filter((t=>t.sessionId===d.value.sessionId))),d.value.paymentStatus&&(t=t.filter((t=>t.paymentStatus===d.value.paymentStatus))),t})),v=t=>t?new Date(t).toLocaleString("zh-TW",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}):"未知時間";return{registrations:e,sessions:a,loading:l,filterOptions:d,filteredRegistrations:p,selectedRegistration:i,getSessionTitle:u,applyFilters:k,markAsPaid:m,viewRegistrationDetails:b,deleteRegistration:L,formatDate:v}}},V=a(1241);const B=(0,V.A)(T,[["render",F],["__scopeId","data-v-554f6fc4"]]);var J=B}}]);
//# sourceMappingURL=172.ae01afd7.js.map
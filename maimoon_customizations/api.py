import frappe


@frappe.whitelist()
def set_company_default(company):
    frappe.defaults.set_user_default("company", company, frappe.session.user)
    return "success"
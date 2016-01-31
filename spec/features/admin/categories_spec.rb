require 'rails_helper'

feature 'Admin categories' do

  background do
    admin = create(:administrator)
    login_as(admin.user)
  end

  scenario "Can create new categories", :js do
    visit admin_categories_path

    click_link "Create axis"

    fill_in "category_position", with: 1
    fill_in "name_ca", with: "Eix 1"
    fill_in "name_es", with: "Eje 1"
    fill_in "name_en", with: "Axis 1"
    fill_in_ckeditor 'description_ca', with: 'Aquesta es una categoria'
    fill_in_ckeditor 'description_es', with: 'Esta es una categoría'
    fill_in_ckeditor 'description_en', with: 'This is a category'

    click_button "Create axis"

    expect(page).to have_content "Category created successfully."
    expect(page).to have_content("1. Axis 1")
  end

  xscenario "Edit an existing category", :js do
    create(:category, name: { en: "My axis" })

    visit admin_categories_path

    click_link "Edit"

    fill_in "name_en", with: "My edited axis"

    click_button "Update axis"

    expect(page).to have_content "Category updated successfully."
    expect(page).to have_content("My edited axis")
  end

  scenario "Delete an existing category" do
    create(:category, name: { en: "My axis" })

    visit admin_categories_path

    click_link "Delete"

    expect(page).to have_content "Category deleted successfully."
    expect(page).to_not have_content("My axis")
  end

  scenario "Create a subcategory for an existing category", :js do
    create(:category, name: { en: "My axis" }, position: 1)

    visit admin_categories_path

    click_link "View strategic lines"

    click_link "Create strategic line"

    fill_in "subcategory_position", with: 1
    fill_in "name_ca", with: "Línea de acció 1"
    fill_in "name_es", with: "Línea de acción 1"
    fill_in "name_en", with: "Action line 1"
    fill_in_ckeditor 'description_ca', with: 'Aquesta es una subcategoria'
    fill_in_ckeditor 'description_es', with: 'Esta es una subcategoría'
    fill_in_ckeditor 'description_en', with: 'This is a subcategory'

    click_button "Create strategic line"

    expect(page).to have_content "Subcategory created successfully."
    expect(page).to have_content("1.1. Action line 1")
  end

  xscenario "Edit an existing subcategory", :js do
    category = create(:category, name: { en: "My axis" })
    create(:subcategory, name: { en: "My action line" }, category_id: category.id)

    visit admin_categories_path

    click_link "View strategic lines"

    expect(page).to have_content "My action line"

    click_link "Edit"

    fill_in "name_en", with: "My edited action line"

    click_button "Update strategic line"

    expect(page).to have_content "Subcategory updated successfully."
    expect(page).to have_content("My edited action line")
  end

  scenario "Delete an existing subcategory" do
    category = create(:category, name: { en: "My axis" })
    create(:subcategory, name: { en: "My action line" }, category_id: category.id)

    visit admin_categories_path

    click_link "View strategic lines"
    click_link "Delete"

    expect(page).to have_content "Subcategory deleted successfully."
    expect(page).to_not have_content("My action line")
  end

end

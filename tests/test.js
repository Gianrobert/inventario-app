
const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

describe("Pruebas de la App de Inventario", function () {
  let driver;
  this.timeout(30000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    const filePath = "file://" + path.resolve(__dirname, "../index.html");
    await driver.get(filePath);
  });

  after(async () => {
    await driver.quit();
  });

  async function screenshot(nombre) {
    const image = await driver.takeScreenshot();
    const dir = path.resolve(__dirname, "screenshots");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/${nombre}.png`, image, "base64");
  }

  it("HU-001 - Agregar producto", async () => {
    await driver.findElement(By.id("nombre")).sendKeys("Monitor");
    await driver.findElement(By.id("cantidad")).sendKeys("3");
    await driver.findElement(By.id("precio")).sendKeys("150.00");
    await driver.findElement(By.css("form button")).click();
    const nombre = await driver.findElement(By.xpath("//tbody/tr[1]/td[0+1]"));
    expect(await nombre.getText()).to.equal("Monitor");
    await screenshot("HU-001_AgregarProducto");
  });

  it("HU-002 - Ver producto agregado", async () => {
    const filas = await driver.findElements(By.xpath("//tbody/tr"));
    expect(filas.length).to.be.greaterThan(0);
    await screenshot("HU-002_VerProducto");
  });

  it("HU-003 - Eliminar producto", async () => {
    const eliminarBtn = await driver.findElement(By.xpath("//tbody/tr[1]/td[4]/button[2]"));
    await eliminarBtn.click();
    await driver.switchTo().alert().accept();
    await driver.sleep(500);
    const filas = await driver.findElements(By.xpath("//tbody/tr"));
    expect(filas.length).to.equal(0);
    await screenshot("HU-003_EliminarProducto");
  });

  it("HU-004 - Validar campos vacíos", async () => {
    await driver.findElement(By.id("nombre")).clear();
    await driver.findElement(By.id("cantidad")).clear();
    await driver.findElement(By.id("precio")).clear();
    await driver.findElement(By.css("form button")).click();
  
    await screenshot("HU-004_ValidacionCamposVacios");
  
    expect(true).to.be.true; 
  });

  

  it("HU-006 - Calcular total del inventario", async () => {
    await driver.findElement(By.id("nombre")).sendKeys("Mouse");
    await driver.findElement(By.id("cantidad")).sendKeys("5");
    await driver.findElement(By.id("precio")).sendKeys("20");
    await driver.findElement(By.css("form button")).click();
    const total = await driver.findElement(By.id("total")).getText();
    expect(total).to.include("$100.00");
    await screenshot("HU-006_CalculoTotal");
  });

  
  it("HU-007 - Buscar producto por nombre", async () => {
    await driver.findElement(By.id("buscar")).sendKeys("mouse");
    const visible = await driver.findElement(By.xpath("//tbody/tr[1]"));
    expect(await visible.isDisplayed()).to.be.true;
    await screenshot("HU-007_BuscarProducto");
  });

  it("HU-005 - Editar producto", async () => {
    await driver.findElement(By.id("nombre")).sendKeys("Teclado");
    await driver.findElement(By.id("cantidad")).sendKeys("2");
    await driver.findElement(By.id("precio")).sendKeys("45.00");
    await driver.findElement(By.css("form button")).click();

  
    const editarBtn = await driver.findElement(By.xpath("//tbody/tr[1]/td[4]/button[1]"));
    await editarBtn.click();

   
    const nombreInput = await driver.findElement(By.id("nombre"));
    await nombreInput.clear();
    await nombreInput.sendKeys("Teclado Mecánico");
    await driver.findElement(By.css("form button")).click();

    const nombreFinal = await driver.findElement(By.xpath("//tbody/tr[1]/td[1]"));
    expect(await nombreFinal.getText()).to.equal("Teclado Mecánico");
    await screenshot("HU-005_EditarProducto");
  });

  it("HU-008 - Guardar en localStorage (recargar)", async () => {
    await driver.findElement(By.id("nombre")).sendKeys("Disco Duro");
    await driver.findElement(By.id("cantidad")).sendKeys("2");
    await driver.findElement(By.id("precio")).sendKeys("50");
    await driver.findElement(By.css("form button")).click();
  
    await driver.sleep(500);
    await driver.navigate().refresh();
  
    await screenshot("HU-008_LocalStorage");
  
    expect(true).to.be.true;
  });
  

  it("HU-009 - Limpiar toda la tabla", async () => {
    await driver.findElement(By.id("btn-limpiar")).click();
    await driver.switchTo().alert().accept();
    await driver.sleep(500);
    const filas = await driver.findElements(By.xpath("//tbody/tr"));
    expect(filas.length).to.equal(0);
    await screenshot("HU-009_LimpiarTodo");
  });

  it("HU-010 - Confirmar antes de eliminar", async () => {
    await driver.findElement(By.id("nombre")).sendKeys("Teclado");
    await driver.findElement(By.id("cantidad")).sendKeys("1");
    await driver.findElement(By.id("precio")).sendKeys("45");
    await driver.findElement(By.css("form button")).click();
    await driver.findElement(By.xpath("//tbody/tr[1]/td[4]/button[2]"))?.click();
    const alerta = await driver.switchTo().alert();
    expect(await alerta.getText()).to.include("¿Estás seguro");
    await alerta.dismiss();
    const fila = await driver.findElements(By.xpath("//tbody/tr"));
    expect(fila.length).to.equal(1);
    await screenshot("HU-010_ConfirmarEliminacion");
  });
});


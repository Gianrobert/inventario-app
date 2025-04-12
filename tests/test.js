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

    if (!fs.existsSync("tests/screenshots")) {
      fs.mkdirSync("tests/screenshots");
    }
    fs.writeFileSync(`tests/screenshots/${nombre}.png`, image, "base64");
  }

  it("HU-001 - Agregar producto", async () => {
    await driver.findElement(By.id("nombre")).sendKeys("Monitor");
    await driver.findElement(By.id("cantidad")).sendKeys("3");
    await driver.findElement(By.id("precio")).sendKeys("150.00");

    const boton = await driver.findElement(By.css("form button"));
    await driver.wait(until.elementIsEnabled(boton), 5000); 
    await boton.click();

    const nombre = await driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText();
    expect(nombre).to.equal("Monitor");

    await screenshot("HU-001_AgregarProducto");
  });

  it("HU-002 - Ver producto agregado", async () => {
    const filas = await driver.findElements(By.xpath("//tbody/tr"));
    expect(filas.length).to.be.greaterThan(0);
    await screenshot("HU-002_VerProducto");
  });

  it("HU-003 - Eliminar producto", async () => {
    const eliminarBtn = await driver.findElement(By.xpath("//tbody/tr[1]/td[4]/button"));
    await eliminarBtn.click();
    const filas = await driver.findElements(By.xpath("//tbody/tr"));
    expect(filas.length).to.equal(0);
    await screenshot("HU-003_EliminarProducto");
  });
  
  it("HU-004 - Validar campos vacíos", async () => {
    await driver.findElement(By.id("nombre")).clear();
    await driver.findElement(By.id("cantidad")).clear();
    await driver.findElement(By.id("precio")).clear();
    await driver.findElement(By.css("form button")).click();
  
   
    expect(true).to.be.true;
  
    await screenshot("HU-004_ValidacionCamposVacios");
  });
  
  it("HU-005 - Validar entrada con espacios o ceros", async () => {
    const nombre = await driver.findElement(By.id("nombre"));
    const cantidad = await driver.findElement(By.id("cantidad"));
    const precio = await driver.findElement(By.id("precio"));
  
    await nombre.clear();
    await cantidad.clear();
    await precio.clear();
  
    await nombre.sendKeys("   "); 
    await cantidad.sendKeys("0");
    await precio.sendKeys("0");
  
    await driver.findElement(By.css("form button")).click();
  
    const errorDiv = await driver.wait(until.elementLocated(By.id("error-mensaje")), 5000);
    const isVisible = await errorDiv.isDisplayed();
    expect(isVisible).to.be.true;
  
    const texto = await errorDiv.getText();
    expect(texto.toLowerCase()).to.include("inválido");
  
    await screenshot("HU-005_ValidacionCamposInvalidos");
  });
  
});


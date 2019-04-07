import PageManager from "./page_manager";
import MutationManager from "./mutation_manager"
import ConfigManager from "./config_manager"

  class MagentoPlugin {
    constructor(options) {
      this.options = options
      
      this._initPlugin()
  
      // Manages the mapping of the form configurations to the DOM. 
      this.PageManager = null
  
      // Manages the form configuraions, and creates any dynamic forms
      this.ConfigManager = new ConfigManager()
  
      // Watches for any mutations to the DOM, so we can reload our configurations when something changes.
      new MutationManager({
        mutationEventHandler: this.mutationEventHandler.bind(this),
        ignoredClass: "af_list"
      })
    }
  
    mutationEventHandler() {
      // When the form mutates, reload our form configurations, and reload the form helpers in the page manager.
      let addressFormConfigurations = this.ConfigManager.load()
      if (this.PageManager) {
        this.PageManager.reload(addressFormConfigurations)
      }
    }
  
    _initPlugin(){
  
        const widgetConfig = {
          nzKey: this.options.licenceKey,
          auKey: this.options.licenceKey,
          nzWidgetOptions: this.options.widgetOptions || {},
          auWidgetOptions: this.options.widgetOptions || {},
          debug: this.options.debugMode || false
        }
    
        this.PageManager = new PageManager({
          addressFormConfigurations: this.ConfigManager.load(),
          widgetConfig,
          eventToDispatch: 'input' 
        })
      
        window.AddressFinderPlugin._magentoPlugin = this.PageManager
    }
  }